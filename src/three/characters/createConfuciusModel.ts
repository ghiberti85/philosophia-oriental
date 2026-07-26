import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export type ProceduralModelOptions = {
  wireframe?: boolean;
  castShadow?: boolean;
  receiveShadow?: boolean;
  textureSize?: number;
  textureAnisotropy?: number;
  qualityPriority?: 'reference-fidelity' | 'balanced';
};

export type ProceduralModelRuntime = {
  nodes: Record<string, THREE.Object3D>;
  meshes: Record<string, THREE.Mesh>;
  sockets: Record<string, THREE.Object3D>;
  colliders: Record<string, unknown>;
  destructionGroups: Record<string, THREE.Object3D[]>;
};

type SculptMaterialSpec = Record<string, any>;

function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function readLayerNumber(value: unknown, keys: string[], fallback: number): number {
  if (typeof value === 'number') return value;
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    for (const key of keys) {
      if (typeof record[key] === 'number') return record[key] as number;
    }
  }
  return fallback;
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = /^#[0-9a-f]{3}$/i.test(hex)
    ? '#' + hex.slice(1).split('').map((part) => part + part).join('')
    : hex;
  const value = /^#[0-9a-f]{6}$/i.test(normalized) ? Number.parseInt(normalized.slice(1), 16) : 0x8a7a5f;
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function materialPalette(spec: SculptMaterialSpec): string[] {
  const palette = spec.colorVariation?.palette;
  if (Array.isArray(palette) && palette.length > 0) return palette.filter((value) => typeof value === 'string');
  const secondary = spec.albedo?.secondary;
  const colors = [spec.baseColor ?? spec.color ?? spec.albedo?.dominant, ...(Array.isArray(secondary) ? secondary : [])];
  return colors.filter((value): value is string => typeof value === 'string' && value.startsWith('#'));
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function smoothCurve(value: number): number {
  return value * value * (3 - 2 * value);
}

function periodicHash(x: number, y: number, seed: number, periodX: number, periodY: number): number {
  const wrappedX = ((x % periodX) + periodX) % periodX;
  const wrappedY = ((y % periodY) + periodY) % periodY;
  let value = Math.imul(wrappedX + seed * 17, 374761393) ^ Math.imul(wrappedY + seed * 31, 668265263);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
}

function periodicValueNoise(u: number, v: number, seed: number, periodX: number, periodY: number): number {
  const x = u * periodX;
  const y = v * periodY;
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const tx = smoothCurve(x - x0);
  const ty = smoothCurve(y - y0);
  const a = periodicHash(x0, y0, seed, periodX, periodY);
  const b = periodicHash(x0 + 1, y0, seed, periodX, periodY);
  const c = periodicHash(x0, y0 + 1, seed, periodX, periodY);
  const d = periodicHash(x0 + 1, y0 + 1, seed, periodX, periodY);
  return THREE.MathUtils.lerp(THREE.MathUtils.lerp(a, b, tx), THREE.MathUtils.lerp(c, d, tx), ty);
}

type SurfaceBand = {
  frequency: number;
  amplitude: number;
  stretchX: number;
  stretchY: number;
  ridge: boolean;
};

function surfaceBands(spec: SculptMaterialSpec): SurfaceBand[] {
  const source = Array.isArray(spec.surfaceFrequencyBands) ? spec.surfaceFrequencyBands : [];
  const parsed = source.flatMap((item: unknown) => {
    if (!item || typeof item !== 'object') return [];
    const band = item as Record<string, unknown>;
    const frequency = typeof band.frequency === 'number' ? band.frequency : 0;
    const amplitude = typeof band.amplitude === 'number' ? band.amplitude : 0;
    if (frequency <= 0 || amplitude <= 0) return [];
    const stretch = Array.isArray(band.stretch) ? band.stretch : [1, 1];
    const description = `${String(band.pattern ?? '')} ${String(band.role ?? '')}`.toLowerCase();
    return [{
      frequency,
      amplitude,
      stretchX: typeof stretch[0] === 'number' ? Math.max(0.1, stretch[0]) : 1,
      stretchY: typeof stretch[1] === 'number' ? Math.max(0.1, stretch[1]) : 1,
      ridge: /(ridge|groove|grain|fiber|striated|crack)/.test(description),
    }];
  });
  return parsed.length > 0 ? parsed : [
    { frequency: 2, amplitude: 0.42, stretchX: 1, stretchY: 1, ridge: false },
    { frequency: 12, amplitude: 0.22, stretchX: 1, stretchY: 1, ridge: false },
    { frequency: 56, amplitude: 0.08, stretchX: 1, stretchY: 1, ridge: false },
  ];
}

function sampleSurface(u: number, v: number, bands: SurfaceBand[], seed: number): number {
  let value = 0;
  let weight = 0;
  for (let index = 0; index < bands.length; index += 1) {
    const band = bands[index];
    const periodX = Math.max(1, Math.round(band.frequency * band.stretchX));
    const periodY = Math.max(1, Math.round(band.frequency * band.stretchY));
    let sample = periodicValueNoise(u, v, seed + index * 1013, periodX, periodY);
    if (band.ridge) sample = 1 - Math.abs(sample * 2 - 1);
    value += sample * band.amplitude;
    weight += band.amplitude;
  }
  return weight > 0 ? clamp01(value / weight) : 0.5;
}

function mixPalette(colors: [number, number, number][], value: number): [number, number, number] {
  if (colors.length === 1) return colors[0];
  const scaled = clamp01(value) * (colors.length - 1);
  const index = Math.min(colors.length - 2, Math.floor(scaled));
  const mix = scaled - index;
  const a = colors[index];
  const b = colors[index + 1];
  return [
    Math.round(THREE.MathUtils.lerp(a[0], b[0], mix)),
    Math.round(THREE.MathUtils.lerp(a[1], b[1], mix)),
    Math.round(THREE.MathUtils.lerp(a[2], b[2], mix)),
  ];
}

type ColorGradientStop = { offset: number; color: string };
type ColorGradientSpec = {
  type: 'linear' | 'radial';
  axis: [number, number];
  stops: ColorGradientStop[];
};

function parseRgba(value: string): [number, number, number] {
  const match = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(value);
  if (!match) return [138, 122, 95];
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

// Analytical per-pixel gradient sample. The extraction schema's colorGradient carries
// exact rgba(...) stop colors (see extract_part_color_recipe.py), so this samples the
// same trend directly in JS math rather than round-tripping through a Canvas 2D
// createLinearGradient/createRadialGradient object — same visual result, and it composes
// directly with the existing noise/height-correlated colorVariation blend below.
function sampleColorGradient(gradient: ColorGradientSpec, u: number, v: number): [number, number, number] {
  const stops = gradient.stops.length >= 2 ? gradient.stops : [{ offset: 0, color: 'rgba(138,122,95,1)' }, { offset: 1, color: 'rgba(138,122,95,1)' }];
  let t: number;
  if (gradient.type === 'radial') {
    const [cx, cy] = gradient.axis;
    const dx = u - cx;
    const dy = v - cy;
    const maxRadius = Math.max(0.001, Math.hypot(Math.max(cx, 1 - cx), Math.max(cy, 1 - cy)));
    t = clamp01(Math.hypot(dx, dy) / maxRadius);
  } else {
    const [ax, ay] = gradient.axis;
    const projection = (u - 0.5) * ax + (v - 0.5) * ay;
    const maxProjection = 0.5 * (Math.abs(ax) + Math.abs(ay)) || 0.5;
    t = clamp01(projection / maxProjection + 0.5);
  }
  const scaled = t * (stops.length - 1);
  const index = Math.min(stops.length - 2, Math.max(0, Math.floor(scaled)));
  const mix = scaled - index;
  const a = parseRgba(stops[index].color);
  const b = parseRgba(stops[index + 1].color);
  return [
    THREE.MathUtils.lerp(a[0], b[0], mix),
    THREE.MathUtils.lerp(a[1], b[1], mix),
    THREE.MathUtils.lerp(a[2], b[2], mix),
  ];
}

function writePixel(data: Uint8ClampedArray, offset: number, red: number, green: number, blue: number): void {
  data[offset] = Math.max(0, Math.min(255, Math.round(red)));
  data[offset + 1] = Math.max(0, Math.min(255, Math.round(green)));
  data[offset + 2] = Math.max(0, Math.min(255, Math.round(blue)));
  data[offset + 3] = 255;
}

function makeCanvas(size: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  return canvas;
}

function createMapTexture(
  canvas: HTMLCanvasElement,
  colorSpace: THREE.ColorSpace,
  spec: SculptMaterialSpec,
  options: ProceduralModelOptions,
): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  const projection = spec.textureProjection && typeof spec.textureProjection === 'object' ? spec.textureProjection : {};
  const repeat = Array.isArray(projection.repeat) ? projection.repeat : [2, 2];
  texture.colorSpace = colorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(
    typeof repeat[0] === 'number' ? repeat[0] : 2,
    typeof repeat[1] === 'number' ? repeat[1] : 2,
  );
  texture.anisotropy = Math.max(1, Math.round(options.textureAnisotropy ?? projection.anisotropy ?? 8));
  texture.needsUpdate = true;
  return texture;
}

type ProceduralTextureSet = {
  albedo: THREE.Texture;
  roughness: THREE.Texture;
  height: THREE.Texture;
  normal: THREE.Texture;
  ao: THREE.Texture;
  source: 'reference-pixel-extraction' | 'procedural';
};

function referenceMapUrl(spec: SculptMaterialSpec, channel: string): string | null {
  const reference = spec.referencePbr;
  if (!reference || typeof reference !== 'object') return null;
  if (reference.usable === false) return null;
  const confidence = typeof reference.confidence === 'number'
    ? reference.confidence
    : (typeof reference.estimatedFidelity === 'number' ? reference.estimatedFidelity : 0);
  const threshold = typeof reference.targetThreshold === 'number' ? reference.targetThreshold : 0.7;
  if (confidence < threshold) return null;
  const maps = reference.maps;
  if (!maps || typeof maps !== 'object') return null;
  const map = (maps as Record<string, unknown>)[channel];
  if (!map || typeof map !== 'object') return null;
  const record = map as Record<string, unknown>;
  const url = typeof record.url === 'string' && record.url.trim() ? record.url : record.path;
  return typeof url === 'string' && url.trim() ? url : null;
}

function createLoadedMapTexture(
  url: string,
  colorSpace: THREE.ColorSpace,
  spec: SculptMaterialSpec,
  options: ProceduralModelOptions,
): THREE.Texture {
  const texture = new THREE.TextureLoader().load(url);
  const projection = spec.textureProjection && typeof spec.textureProjection === 'object' ? spec.textureProjection : {};
  const repeat = Array.isArray(projection.repeat) ? projection.repeat : [1, 1];
  texture.colorSpace = colorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(
    typeof repeat[0] === 'number' ? repeat[0] : 1,
    typeof repeat[1] === 'number' ? repeat[1] : 1,
  );
  texture.anisotropy = Math.max(1, Math.round(options.textureAnisotropy ?? projection.anisotropy ?? 8));
  texture.needsUpdate = true;
  return texture;
}

function makeReferenceTextureSet(spec: SculptMaterialSpec, options: ProceduralModelOptions): ProceduralTextureSet | null {
  const albedo = referenceMapUrl(spec, 'albedo');
  const roughness = referenceMapUrl(spec, 'roughness');
  const height = referenceMapUrl(spec, 'height');
  const normal = referenceMapUrl(spec, 'normal');
  const ao = referenceMapUrl(spec, 'ao');
  if (!albedo || !roughness || !height || !normal || !ao) return null;
  return {
    albedo: createLoadedMapTexture(albedo, THREE.SRGBColorSpace, spec, options),
    roughness: createLoadedMapTexture(roughness, THREE.NoColorSpace, spec, options),
    height: createLoadedMapTexture(height, THREE.NoColorSpace, spec, options),
    normal: createLoadedMapTexture(normal, THREE.NoColorSpace, spec, options),
    ao: createLoadedMapTexture(ao, THREE.NoColorSpace, spec, options),
    source: 'reference-pixel-extraction',
  };
}

function makeProceduralTextureSet(
  id: string,
  spec: SculptMaterialSpec,
  options: ProceduralModelOptions,
): ProceduralTextureSet | null {
  if (typeof document === 'undefined') return null;
  const qualityFirst = (options.qualityPriority ?? 'reference-fidelity') === 'reference-fidelity';
  const requested = options.textureSize ?? spec.textureResolution;
  const requestedSize = typeof requested === 'number' && Number.isFinite(requested)
    ? requested
    : (qualityFirst ? 1024 : 512);
  const size = Math.max(256, Math.min(2048, 2 ** Math.round(Math.log2(requestedSize))));
  const canvases = {
    albedo: makeCanvas(size),
    roughness: makeCanvas(size),
    height: makeCanvas(size),
    normal: makeCanvas(size),
    ao: makeCanvas(size),
  };
  const contexts = {
    albedo: canvases.albedo.getContext('2d'),
    roughness: canvases.roughness.getContext('2d'),
    height: canvases.height.getContext('2d'),
    normal: canvases.normal.getContext('2d'),
    ao: canvases.ao.getContext('2d'),
  };
  if (!contexts.albedo || !contexts.roughness || !contexts.height || !contexts.normal || !contexts.ao) return null;
  const images = {
    albedo: contexts.albedo.createImageData(size, size),
    roughness: contexts.roughness.createImageData(size, size),
    height: contexts.height.createImageData(size, size),
    normal: contexts.normal.createImageData(size, size),
    ao: contexts.ao.createImageData(size, size),
  };
  const seed = hashString(id);
  const bands = surfaceBands(spec);
  const heightField = new Float32Array(size * size);
  const roughnessField = new Float32Array(size * size);
  const palette = materialPalette(spec);
  const fallback = typeof spec.baseColor === 'string' ? spec.baseColor : '#8A7A5F';
  const colors = (palette.length >= 2 ? palette : [fallback, '#6E614B', '#A08F70']).map(hexToRgb);
  const baseRoughness = clamp01(readLayerNumber(spec.roughness, ['base'], 0.76));
  const roughnessVariation = clamp01(readLayerNumber(spec.roughness, ['variation'], 0.18));
  const colorAmplitude = clamp01(readLayerNumber(spec.colorVariation, ['amplitude', 'variation'], 0.18));
  const heightCorrelation = clamp01(readLayerNumber(spec.colorVariation, ['heightCorrelation'], 0.3));
  const colorGradient: ColorGradientSpec | undefined = spec.colorGradient;
  for (let y = 0; y < size; y += 1) {
    const v = y / size;
    for (let x = 0; x < size; x += 1) {
      const u = x / size;
      const index = y * size + x;
      const height = sampleSurface(u, v, bands, seed + 101);
      const roughNoise = sampleSurface(u, v, bands, seed + 7001);
      const colorNoise = sampleSurface(u, v, bands, seed + 15013);
      heightField[index] = height;
      roughnessField[index] = clamp01(baseRoughness + (roughNoise - 0.5) * roughnessVariation * 2);
      let color: [number, number, number];
      if (colorGradient) {
        // Evidence-derived spatial gradient (Plan 1.3 Workstream C) takes priority
        // over the noise-based palette blend below — it is a measured trend, not a guess.
        color = sampleColorGradient(colorGradient, u, v);
      } else {
        const paletteValue = clamp01(
          0.5 + (colorNoise - 0.5) * colorAmplitude * 2 + (height - 0.5) * heightCorrelation
        );
        color = mixPalette(colors, paletteValue);
      }
      writePixel(images.albedo.data, index * 4, color[0], color[1], color[2]);
    }
  }
  const normalStrength = Math.max(0.05, readLayerNumber(spec.normal, ['strength', 'amplitude'], 0.35));
  const aoStrength = clamp01(readLayerNumber(spec.ambientOcclusion, ['cavityStrength', 'strength'], 0.35));
  for (let y = 0; y < size; y += 1) {
    const up = ((y - 1 + size) % size) * size;
    const down = ((y + 1) % size) * size;
    for (let x = 0; x < size; x += 1) {
      const left = (x - 1 + size) % size;
      const right = (x + 1) % size;
      const index = y * size + x;
      const center = heightField[index];
      const dx = (heightField[y * size + right] - heightField[y * size + left]) * normalStrength * 6;
      const dy = (heightField[down + x] - heightField[up + x]) * normalStrength * 6;
      const inverseLength = 1 / Math.sqrt(dx * dx + dy * dy + 1);
      const normalX = -dx * inverseLength;
      const normalY = -dy * inverseLength;
      const normalZ = inverseLength;
      const neighborAverage = (
        heightField[y * size + left] + heightField[y * size + right]
        + heightField[up + x] + heightField[down + x]
      ) * 0.25;
      const cavity = Math.max(0, neighborAverage - center);
      const ao = clamp01(1 - aoStrength * (cavity * 12 + (1 - center) * 0.16));
      const offset = index * 4;
      const heightByte = center * 255;
      const roughnessByte = roughnessField[index] * 255;
      writePixel(images.height.data, offset, heightByte, heightByte, heightByte);
      writePixel(images.roughness.data, offset, roughnessByte, roughnessByte, roughnessByte);
      writePixel(
        images.normal.data, offset,
        (normalX * 0.5 + 0.5) * 255,
        (normalY * 0.5 + 0.5) * 255,
        (normalZ * 0.5 + 0.5) * 255,
      );
      writePixel(images.ao.data, offset, ao * 255, ao * 255, ao * 255);
    }
  }
  contexts.albedo.putImageData(images.albedo, 0, 0);
  contexts.roughness.putImageData(images.roughness, 0, 0);
  contexts.height.putImageData(images.height, 0, 0);
  contexts.normal.putImageData(images.normal, 0, 0);
  contexts.ao.putImageData(images.ao, 0, 0);
  return {
    albedo: createMapTexture(canvases.albedo, THREE.SRGBColorSpace, spec, options),
    roughness: createMapTexture(canvases.roughness, THREE.NoColorSpace, spec, options),
    height: createMapTexture(canvases.height, THREE.NoColorSpace, spec, options),
    normal: createMapTexture(canvases.normal, THREE.NoColorSpace, spec, options),
    ao: createMapTexture(canvases.ao, THREE.NoColorSpace, spec, options),
    source: 'procedural',
  };
}

function createSculptMaterial(id: string, spec: SculptMaterialSpec, options: ProceduralModelOptions): THREE.MeshPhysicalMaterial {
  const textures = makeReferenceTextureSet(spec, options) ?? makeProceduralTextureSet(id, spec, options);
  const material = new THREE.MeshPhysicalMaterial({
    color: textures ? 0xffffff : new THREE.Color(typeof spec.baseColor === 'string' ? spec.baseColor : '#8A7A5F'),
    roughness: textures ? 1 : clamp01(readLayerNumber(spec.roughness, ['base'], 0.76)),
    metalness: clamp01(readLayerNumber(spec.metalness, ['base'], 0.0)),
    clearcoat: clamp01(readLayerNumber(spec.clearcoat, ['base', 'amount'], 0)),
    clearcoatRoughness: clamp01(readLayerNumber(spec.clearcoatRoughness, ['base'], 0.25)),
    transmission: clamp01(readLayerNumber(spec.transmission, ['base', 'amount'], 0)),
    ior: Math.max(1, readLayerNumber(spec.ior, ['base', 'value'], 1.5)),
    thickness: Math.max(0, readLayerNumber(spec.thickness, ['base', 'amount'], 0)),
    attenuationDistance: Math.max(0.001, readLayerNumber(spec.attenuationDistance, ['base', 'value'], Infinity)),
    attenuationColor: new THREE.Color(typeof spec.attenuationColor === 'string' ? spec.attenuationColor : '#ffffff'),
    sheen: clamp01(readLayerNumber(spec.sheen, ['base', 'amount'], 0)),
    sheenColor: new THREE.Color(typeof spec.sheenColor === 'string' ? spec.sheenColor : '#ffffff'),
    sheenRoughness: clamp01(readLayerNumber(spec.sheenRoughness, ['base'], 1.0)),
    iridescence: clamp01(readLayerNumber(spec.iridescence, ['base', 'amount'], 0)),
    iridescenceIOR: Math.max(1, readLayerNumber(spec.iridescenceIOR, ['base', 'value'], 1.3)),
    anisotropy: clamp01(readLayerNumber(spec.anisotropy, ['base', 'amount'], 0)),
    anisotropyRotation: readLayerNumber(spec.anisotropy, ['rotation'], 0),
    specularIntensity: clamp01(readLayerNumber(spec.specularIntensity, ['base'], 1.0)),
    specularColor: new THREE.Color(typeof spec.specularColor === 'string' ? spec.specularColor : '#ffffff'),
    emissive: new THREE.Color(typeof spec.emissive === 'string' ? spec.emissive : '#000000'),
    emissiveIntensity: Math.max(0, readLayerNumber(spec.emissiveIntensity, ['base'], 1.0)),
    opacity: clamp01(readLayerNumber(spec.opacity, ['base'], 1)),
    transparent: readLayerNumber(spec.transmission, ['base', 'amount'], 0) > 0 || readLayerNumber(spec.opacity, ['base'], 1) < 1,
    alphaTest: Math.max(0, readLayerNumber(spec.alpha, ['cutoff', 'alphaTest'], 0)),
    wireframe: options.wireframe ?? false,
    side: spec.doubleSided === true ? THREE.DoubleSide : THREE.FrontSide,
  });
  if (textures) {
    material.map = textures.albedo;
    material.roughnessMap = textures.roughness;
    material.normalMap = textures.normal;
    material.normalScale.setScalar(Math.max(0.05, readLayerNumber(spec.normal, ['strength', 'amplitude'], 0.35)));
    material.aoMap = textures.ao;
    material.aoMap.channel = 0;
    material.aoMapIntensity = readLayerNumber(spec.ambientOcclusion, ['cavityStrength', 'strength'], 0.35);
    const bumpScale = Math.max(0, readLayerNumber(spec.bump, ['amplitude', 'strength'], 0));
    if (bumpScale > 0) {
      material.bumpMap = textures.height;
      material.bumpScale = bumpScale;
    }
    const displacementScale = Math.max(0, readLayerNumber(spec.displacement, ['amplitude', 'strength'], 0));
    if (displacementScale > 0) {
      material.displacementMap = textures.height;
      material.displacementScale = displacementScale;
      material.displacementBias = -displacementScale * 0.5;
    }
  }
  material.envMapIntensity = readLayerNumber(spec, ['envMapIntensity'], 0.8);
  material.userData.sculptMaterial = spec;
  material.userData.proceduralMapsIndependent = true;
  material.userData.pbrTextureSource = textures?.source ?? 'flat-fallback';
  material.userData.referencePbr = spec.referencePbr ?? null;
  material.needsUpdate = true;
  return material;
}

type AttachmentEndpoint = {
  start: THREE.Vector3;
  midpoint: THREE.Vector3;
  quaternion: THREE.Quaternion;
  length: number;
  baseRadius: number;
  endRadius: number;
};

function readVector3(value: unknown, fallback: [number, number, number]): THREE.Vector3 {
  if (Array.isArray(value) && value.length === 3 && value.every((item) => typeof item === 'number')) {
    return new THREE.Vector3(value[0], value[1], value[2]);
  }
  return new THREE.Vector3(fallback[0], fallback[1], fallback[2]);
}

function readNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function makeAttachmentEndpoint(attachment: unknown): AttachmentEndpoint | null {
  if (!attachment || typeof attachment !== 'object') return null;
  const record = attachment as Record<string, unknown>;
  const start = readVector3(record.localStart, [0, 0, 0]);
  const end = readVector3(record.localEnd, [0, 1, 0]);
  const delta = end.clone().sub(start);
  const length = delta.length();
  if (length <= 0.0001) return null;
  const direction = delta.clone().normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
  const baseRadius = Math.max(0.005, readNumber(record.baseRadius, 0.06));
  const endRadius = Math.max(0.003, readNumber(record.endRadius, baseRadius * 0.55));
  return {
    start,
    midpoint: delta.multiplyScalar(0.5),
    quaternion,
    length,
    baseRadius,
    endRadius,
  };
}

// Generated from ObjectSculptSpec target: Confucius seated bust
// Sculpt build pass: blockout
// This factory is intentionally pass-gated. Finish browser screenshot review before unlocking deeper passes.
export function createConfuciusSeatedBustModel(options: ProceduralModelOptions = {}): THREE.Group {
  const root = new THREE.Group();
  root.name = "Confucius seated bust";
  root.userData.reconstructionEvidence = {"itemFamily": null, "subtype": null, "componentAdapter": null, "route": null, "exactnessTier": null, "referenceCamera": {"solved": false, "fovDegrees": 40.0, "aspect": 1.0, "orientation": {"yaw": 0.0, "pitch": 0.0, "roll": 0.0}, "positionHint": [0.0, 0.0, 3.0], "note": "For likeness work, solve the reference camera (forge/stage1_intake/solve_camera_pose.py) so the review render aligns with the photo and the reference can be projected. Confirm by overlay review."}, "approximationNotes": []};

  const materialMap: Record<string, THREE.Material> = {};
  materialMap["base"] = createSculptMaterial(
    "base",
    {"id": "base", "name": "Base material", "type": "standard", "shaderModel": "MeshStandardMaterial / PBR approximation", "baseColor": "#8A7A5F", "color": "#8A7A5F", "albedo": {"dominant": "#8A7A5F", "secondary": ["#6E614B", "#A08F70"], "samplingNotes": "Use image-observed local color zones, not a single averaged color."}, "colorVariation": {"palette": ["#8A7A5F", "#6E614B", "#A08F70"], "pattern": "mottled", "amplitude": 0.15, "heightCorrelation": 0.3}, "textureResolution": 1024, "textureProjection": {"mode": "uv", "repeat": [2.0, 2.0], "anisotropy": 8, "texelDensityIntent": "Preserve stable world/object-scale detail; do not stretch micro detail with component scale."}, "surfaceFrequencyBands": [{"id": "macro", "frequency": 2.0, "amplitude": 0.42, "role": "broad color and height breakup"}, {"id": "meso", "frequency": 12.0, "amplitude": 0.22, "role": "ridges, pores, grain, dents, or equivalent visible relief"}, {"id": "micro", "frequency": 56.0, "amplitude": 0.08, "role": "highlight breakup visible under grazing light"}], "roughness": {"base": 0.75, "variation": 0.15, "map": "independent-procedural-field", "localResponse": "higher roughness in cavities, lower roughness on worn edges"}, "metalness": {"base": 0.0, "variation": 0.0}, "normal": {"pattern": "derived-from-independent-height-field", "strength": 0.35, "scale": 24.0, "space": "tangent"}, "bump": {"pattern": "none", "amplitude": 0.0, "scale": 1.0}, "displacement": {"pattern": "none", "amplitude": 0.0, "scale": 1.0, "silhouetteAffects": false}, "ambientOcclusion": {"cavityStrength": 0.25, "contactShadowBias": 0.35, "notes": "Darken creases, seams, intersections, and recessed local features."}, "wear": {"edgeWear": 0.0, "scratches": [], "chips": []}, "dirt": {"amount": 0.0, "cavityBias": 0.0, "color": "#2F2A22"}, "localOverrides": [], "shaderNotes": ["Prefer MeshPhysicalMaterial when clearcoat, sheen, transmission, or thin-surface response is observed; otherwise use MeshStandardMaterial-compatible PBR channels.", "Generate albedo, roughness, height/normal, and AO independently; never alias albedo into roughness.", "Use normal/bump/displacement only when they map to observed surface relief.", "Use displacement geometry when the observed relief changes the close-up silhouette; texture-only relief is insufficient there."], "notes": "Replace with image-derived color, roughness, noise, and edge-wear notes."},
    options
  );
  materialMap["hidden"] = createSculptMaterial(
    "hidden",
    {"id": "hidden", "name": "Base material", "type": "standard", "shaderModel": "MeshStandardMaterial / PBR approximation", "baseColor": "#000000", "color": "#000000", "albedo": {"dominant": "#000000", "secondary": ["#000000"]}, "colorVariation": {"palette": ["#000000", "#000000"], "pattern": "flat", "amplitude": 0.05, "heightCorrelation": 0.0}, "textureResolution": 1024, "textureProjection": {"mode": "uv", "repeat": [2.0, 2.0], "anisotropy": 8, "texelDensityIntent": "Preserve stable world/object-scale detail; do not stretch micro detail with component scale."}, "surfaceFrequencyBands": [{"id": "macro", "frequency": 2.0, "amplitude": 0.42, "role": "broad color and height breakup"}, {"id": "meso", "frequency": 12.0, "amplitude": 0.22, "role": "ridges, pores, grain, dents, or equivalent visible relief"}, {"id": "micro", "frequency": 56.0, "amplitude": 0.08, "role": "highlight breakup visible under grazing light"}], "roughness": {"base": 1.0, "variation": 0.0}, "metalness": {"base": 0.0, "variation": 0.0}, "normal": {"pattern": "derived-from-independent-height-field", "strength": 0.35, "scale": 24.0, "space": "tangent"}, "bump": {"pattern": "none", "amplitude": 0.0, "scale": 1.0}, "displacement": {"pattern": "none", "amplitude": 0.0, "scale": 1.0, "silhouetteAffects": false}, "ambientOcclusion": {"cavityStrength": 0.25, "contactShadowBias": 0.35, "notes": "Darken creases, seams, intersections, and recessed local features."}, "wear": {"edgeWear": 0.0, "scratches": [], "chips": []}, "dirt": {"amount": 0.0, "cavityBias": 0.0, "color": "#2F2A22"}, "localOverrides": [], "shaderNotes": ["Prefer MeshPhysicalMaterial when clearcoat, sheen, transmission, or thin-surface response is observed; otherwise use MeshStandardMaterial-compatible PBR channels.", "Generate albedo, roughness, height/normal, and AO independently; never alias albedo into roughness.", "Use normal/bump/displacement only when they map to observed surface relief.", "Use displacement geometry when the observed relief changes the close-up silhouette; texture-only relief is insufficient there."], "notes": "Replace with image-derived color, roughness, noise, and edge-wear notes.", "opacity": {"base": 0.0}},
    options
  );
  materialMap["skin"] = createSculptMaterial(
    "skin",
    {"id": "skin", "kind": "MeshStandardMaterial", "baseColorHex": "#c9986f", "roughness": 0.65, "metalness": 0.0, "localOverrides": ["head.faceWrinkles"], "notes": "Warm-toned aged skin, low-mid roughness, no true SSS; slightly desaturated shadow tint per grimoire/character/reconstruction.md skin recipe."},
    options
  );
  materialMap["hair"] = createSculptMaterial(
    "hair",
    {"id": "hair", "kind": "MeshStandardMaterial", "baseColorHex": "#8f8a86", "roughness": 0.8, "metalness": 0.0, "localOverrides": ["beard.clumpSystem"], "notes": "Grey/white stylized hair clumps (beard, mustache, eyebrows, temple fringe) — no strand-level geometry, per single-image reconstruction guidance."},
    options
  );
  materialMap["robeSilk"] = createSculptMaterial(
    "robeSilk",
    {"id": "robeSilk", "kind": "MeshPhysicalMaterial", "baseColorHex": "#8a2f1f", "roughness": 0.42, "metalness": 0.0, "clearcoat": 0.15, "clearcoatRoughness": 0.3, "localOverrides": ["robeChest.dragonMedallionMask", "rightSleeve.drape"], "notes": "Rust-red silk, moderate sheen (clearcoat) reading as satin/brocade; gold dragon-medallion embroidery as an albedo + normal local override mask."},
    options
  );
  materialMap["collarSilk"] = createSculptMaterial(
    "collarSilk",
    {"id": "collarSilk", "kind": "MeshStandardMaterial", "baseColorHex": "#1c1a1c", "roughness": 0.5, "metalness": 0.0, "localOverrides": ["collarPanel.embroideryMask"], "notes": "Black inner lapel panel; gold-thread dragon/cloud embroidery as a brighter albedo mask, thin gold piping edge."},
    options
  );
  materialMap["sashSilk"] = createSculptMaterial(
    "sashSilk",
    {"id": "sashSilk", "kind": "MeshStandardMaterial", "baseColorHex": "#211d1f", "roughness": 0.48, "metalness": 0.0, "localOverrides": ["waistSash"], "notes": "Diagonal black waist sash, same embroidery-mask treatment as the collar panel, gold piping edge."},
    options
  );
  materialMap["cap"] = createSculptMaterial(
    "cap",
    {"id": "cap", "kind": "MeshStandardMaterial", "baseColorHex": "#7a1f22", "roughness": 0.55, "metalness": 0.0, "notes": "Red felt/silk scholar's cap body."},
    options
  );
  materialMap["capTrim"] = createSculptMaterial(
    "capTrim",
    {"id": "capTrim", "kind": "MeshStandardMaterial", "baseColorHex": "#4a1416", "roughness": 0.5, "metalness": 0.0, "notes": "Dark maroon trim band and ribbon ties."},
    options
  );
  materialMap["goldTrim"] = createSculptMaterial(
    "goldTrim",
    {"id": "goldTrim", "kind": "MeshPhysicalMaterial", "baseColorHex": "#c9a341", "roughness": 0.3, "metalness": 0.85, "clearcoat": 0.2, "notes": "Metal-like gold trim/ornament/piping accents (cap button, collar+sash piping, embroidery thread highlights)."},
    options
  );
  materialMap["eyeWhite"] = createSculptMaterial(
    "eyeWhite",
    {"id": "eyeWhite", "kind": "MeshStandardMaterial", "baseColorHex": "#e8e2d8", "roughness": 0.15, "metalness": 0.0, "notes": "Glossy sclera base; iris disc + catchlight are a separate decal/emissive dot per character material recipe."},
    options
  );

  const nodes: Record<string, THREE.Object3D> = { root };
  const meshes: Record<string, THREE.Mesh> = {};
  const sockets: Record<string, THREE.Object3D> = {};
  const colliders: Record<string, unknown> = {};
  const destructionGroups: Record<string, THREE.Object3D[]> = {};

  const attachment_root_0 = null;
  const endpoint_root_0 = makeAttachmentEndpoint(attachment_root_0);
  const node_root_0 = new THREE.Group();
  node_root_0.name = "Character (root)__pivot";
  if (endpoint_root_0) {
    node_root_0.position.copy(endpoint_root_0.start);
    node_root_0.rotation.set(0, 0, 0);
    node_root_0.scale.set(1, 1, 1);
  } else {
    node_root_0.position.set(0.0, 0.0, 0.0);
    node_root_0.rotation.set(0.0, 0.0, 0.0);
    node_root_0.scale.set(1.0, 1.0, 1.0);
  }
  node_root_0.userData.sculptComponent = {"id": "root", "name": "Character (root)", "level": "macro", "role": "body", "importance": 1.0, "confidence": 0.8, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Character (root) is a discrete primitive body part assembled onto the humanoid rig, not a continuous sculpt or shell.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": null, "attachment": null, "dimensions": {"width": 1.0, "height": 1.0, "depth": 1.0, "units": "relative", "confidence": 0.8}, "transform": {"position": [0, 0, 0], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "root", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "root", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "hidden"}}, "material": "hidden", "materialLayers": ["hidden"], "deformations": [], "joints": [], "seams": [], "localFeatures": [], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": ""}, "evidenceRefs": ["full-object"], "details": [], "fidelityTier": "blockout"};
  node_root_0.userData.actionProfile = {"animationRole": "root", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "root", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "hidden"}};
  (nodes["root"] ?? root).add(node_root_0);
  nodes["root"] = node_root_0;
  const mesh_root_0Geometry = endpoint_root_0
    ? new THREE.CylinderGeometry(endpoint_root_0.endRadius, endpoint_root_0.baseRadius, endpoint_root_0.length, 32, 12)
    : new THREE.BoxGeometry(1, 1, 1, 12, 12, 12);
  const mesh_root_0 = new THREE.Mesh(
    mesh_root_0Geometry,
    materialMap["hidden"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_root_0.name = "Character (root)";
  if (endpoint_root_0) {
    mesh_root_0.position.copy(endpoint_root_0.midpoint);
    mesh_root_0.quaternion.copy(endpoint_root_0.quaternion);
  }
  mesh_root_0.castShadow = options.castShadow ?? true;
  mesh_root_0.receiveShadow = options.receiveShadow ?? true;
  mesh_root_0.userData.sculptComponent = {"id": "root", "name": "Character (root)", "level": "macro", "role": "body", "importance": 1.0, "confidence": 0.8, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Character (root) is a discrete primitive body part assembled onto the humanoid rig, not a continuous sculpt or shell.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": null, "attachment": null, "dimensions": {"width": 1.0, "height": 1.0, "depth": 1.0, "units": "relative", "confidence": 0.8}, "transform": {"position": [0, 0, 0], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "root", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "root", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "hidden"}}, "material": "hidden", "materialLayers": ["hidden"], "deformations": [], "joints": [], "seams": [], "localFeatures": [], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": ""}, "evidenceRefs": ["full-object"], "details": [], "fidelityTier": "blockout"};
  node_root_0.add(mesh_root_0);
  meshes["root"] = mesh_root_0;
  colliders["root"] = {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"};
  destructionGroups["root"] ??= [];
  destructionGroups["root"].push(node_root_0);

  const attachment_torso_1 = null;
  const endpoint_torso_1 = makeAttachmentEndpoint(attachment_torso_1);
  const node_torso_1 = new THREE.Group();
  node_torso_1.name = "Robe torso (draped silk)__pivot";
  if (endpoint_torso_1) {
    node_torso_1.position.copy(endpoint_torso_1.start);
    node_torso_1.rotation.set(0, 0, 0);
    node_torso_1.scale.set(1, 1, 1);
  } else {
    node_torso_1.position.set(0.0, 0.18, 0.0);
    node_torso_1.rotation.set(0.0, 0.0, 0.0);
    node_torso_1.scale.set(0.62, 0.55, 0.34);
  }
  node_torso_1.userData.sculptComponent = {"id": "torso", "name": "Robe torso (draped silk)", "level": "macro", "role": "shell", "importance": 1.0, "confidence": 0.8, "primitive": "capsule", "topologyClass": "assembled-solid", "topologyRationale": "Torso (shirt) is a discrete primitive body part assembled onto the humanoid rig, not a continuous sculpt or shell.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.62, "height": 0.55, "depth": 0.34, "units": "relative", "confidence": 0.75}, "transform": {"position": [0, 0.18, 0.0], "rotation": [0, 0, 0], "scale": [0.62, 0.55, 0.34]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "torso", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "shirt"}}, "material": "robeSilk", "materialLayers": ["robeSilk"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["robeChest.dragonMedallionMask"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Macro drape folds radiating from shoulders/underarm; gold dragon-medallion embroidery scattered on chest per detail inventory 'robe-chest'."}, "evidenceRefs": ["zones/robe-chest.png"], "details": [], "fidelityTier": "blockout"};
  node_torso_1.userData.actionProfile = {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "torso", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "shirt"}};
  (nodes["root"] ?? root).add(node_torso_1);
  nodes["torso"] = node_torso_1;
  const mesh_torso_1Geometry = endpoint_torso_1
    ? new THREE.CylinderGeometry(endpoint_torso_1.endRadius, endpoint_torso_1.baseRadius, endpoint_torso_1.length, 32, 12)
    : new THREE.CapsuleGeometry(0.35, 0.7, 16, 32);
  const mesh_torso_1 = new THREE.Mesh(
    mesh_torso_1Geometry,
    materialMap["robeSilk"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_torso_1.name = "Robe torso (draped silk)";
  if (endpoint_torso_1) {
    mesh_torso_1.position.copy(endpoint_torso_1.midpoint);
    mesh_torso_1.quaternion.copy(endpoint_torso_1.quaternion);
  }
  mesh_torso_1.castShadow = options.castShadow ?? true;
  mesh_torso_1.receiveShadow = options.receiveShadow ?? true;
  mesh_torso_1.userData.sculptComponent = {"id": "torso", "name": "Robe torso (draped silk)", "level": "macro", "role": "shell", "importance": 1.0, "confidence": 0.8, "primitive": "capsule", "topologyClass": "assembled-solid", "topologyRationale": "Torso (shirt) is a discrete primitive body part assembled onto the humanoid rig, not a continuous sculpt or shell.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.62, "height": 0.55, "depth": 0.34, "units": "relative", "confidence": 0.75}, "transform": {"position": [0, 0.18, 0.0], "rotation": [0, 0, 0], "scale": [0.62, 0.55, 0.34]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "torso", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "shirt"}}, "material": "robeSilk", "materialLayers": ["robeSilk"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["robeChest.dragonMedallionMask"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Macro drape folds radiating from shoulders/underarm; gold dragon-medallion embroidery scattered on chest per detail inventory 'robe-chest'."}, "evidenceRefs": ["zones/robe-chest.png"], "details": [], "fidelityTier": "blockout"};
  node_torso_1.add(mesh_torso_1);
  meshes["torso"] = mesh_torso_1;
  colliders["torso"] = {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"};
  destructionGroups["torso"] ??= [];
  destructionGroups["torso"].push(node_torso_1);

  const attachment_waist_sash_2 = null;
  const endpoint_waist_sash_2 = makeAttachmentEndpoint(attachment_waist_sash_2);
  const node_waist_sash_2 = new THREE.Group();
  node_waist_sash_2.name = "Waist sash (diagonal, embroidered)__pivot";
  if (endpoint_waist_sash_2) {
    node_waist_sash_2.position.copy(endpoint_waist_sash_2.start);
    node_waist_sash_2.rotation.set(0, 0, 0);
    node_waist_sash_2.scale.set(1, 1, 1);
  } else {
    node_waist_sash_2.position.set(0.05, -0.05, 0.19);
    node_waist_sash_2.rotation.set(0.0, 0.0, 0.0);
    node_waist_sash_2.scale.set(0.14, 0.34, 0.02);
  }
  node_waist_sash_2.userData.sculptComponent = {"id": "waist-sash", "name": "Waist sash (diagonal, embroidered)", "level": "meso", "role": "shell", "importance": 0.55, "confidence": 0.75, "primitive": "plane-card", "topologyClass": "assembled-solid", "topologyRationale": "Waist sash (diagonal, embroidered) is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "bevel", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "torso", "attachment": null, "dimensions": {"width": 0.14, "height": 0.34, "depth": 0.02, "units": "relative", "confidence": 0.75}, "transform": {"position": [0.05, -0.05, 0.19], "rotation": [0, 0, 0], "scale": [0.14, 0.34, 0.02]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "waist-sash", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "sashSilk"}}, "material": "sashSilk", "materialLayers": ["sashSilk"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["waistSash"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Diagonal black sash crossing the waist, gold dragon embroidery, gold piping edge; robe fabric bunches where hands rest."}, "evidenceRefs": ["zones/sash-waist.png"], "details": [], "fidelityTier": "blockout"};
  node_waist_sash_2.userData.actionProfile = {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "waist-sash", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "sashSilk"}};
  (nodes["torso"] ?? root).add(node_waist_sash_2);
  nodes["waist-sash"] = node_waist_sash_2;
  const mesh_waist_sash_2Geometry = endpoint_waist_sash_2
    ? new THREE.CylinderGeometry(endpoint_waist_sash_2.endRadius, endpoint_waist_sash_2.baseRadius, endpoint_waist_sash_2.length, 32, 12)
    : new THREE.PlaneGeometry(1, 1, 24, 24);
  const mesh_waist_sash_2 = new THREE.Mesh(
    mesh_waist_sash_2Geometry,
    materialMap["sashSilk"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_waist_sash_2.name = "Waist sash (diagonal, embroidered)";
  if (endpoint_waist_sash_2) {
    mesh_waist_sash_2.position.copy(endpoint_waist_sash_2.midpoint);
    mesh_waist_sash_2.quaternion.copy(endpoint_waist_sash_2.quaternion);
  }
  mesh_waist_sash_2.castShadow = options.castShadow ?? true;
  mesh_waist_sash_2.receiveShadow = options.receiveShadow ?? true;
  mesh_waist_sash_2.userData.sculptComponent = {"id": "waist-sash", "name": "Waist sash (diagonal, embroidered)", "level": "meso", "role": "shell", "importance": 0.55, "confidence": 0.75, "primitive": "plane-card", "topologyClass": "assembled-solid", "topologyRationale": "Waist sash (diagonal, embroidered) is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "bevel", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "torso", "attachment": null, "dimensions": {"width": 0.14, "height": 0.34, "depth": 0.02, "units": "relative", "confidence": 0.75}, "transform": {"position": [0.05, -0.05, 0.19], "rotation": [0, 0, 0], "scale": [0.14, 0.34, 0.02]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "waist-sash", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "sashSilk"}}, "material": "sashSilk", "materialLayers": ["sashSilk"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["waistSash"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Diagonal black sash crossing the waist, gold dragon embroidery, gold piping edge; robe fabric bunches where hands rest."}, "evidenceRefs": ["zones/sash-waist.png"], "details": [], "fidelityTier": "blockout"};
  node_waist_sash_2.add(mesh_waist_sash_2);
  meshes["waist-sash"] = mesh_waist_sash_2;
  colliders["waist-sash"] = {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"};
  destructionGroups["waist-sash"] ??= [];
  destructionGroups["waist-sash"].push(node_waist_sash_2);

  const attachment_collar_lapel_l_3 = null;
  const endpoint_collar_lapel_l_3 = makeAttachmentEndpoint(attachment_collar_lapel_l_3);
  const node_collar_lapel_l_3 = new THREE.Group();
  node_collar_lapel_l_3.name = "Collar/lapel panel L (dark, embroidered)__pivot";
  if (endpoint_collar_lapel_l_3) {
    node_collar_lapel_l_3.position.copy(endpoint_collar_lapel_l_3.start);
    node_collar_lapel_l_3.rotation.set(0, 0, 0);
    node_collar_lapel_l_3.scale.set(1, 1, 1);
  } else {
    node_collar_lapel_l_3.position.set(-0.12, 0.28, 0.17);
    node_collar_lapel_l_3.rotation.set(0.0, 0.0, 0.0);
    node_collar_lapel_l_3.scale.set(0.16, 0.3, 0.02);
  }
  node_collar_lapel_l_3.userData.sculptComponent = {"id": "collar-lapel-l", "name": "Collar/lapel panel L (dark, embroidered)", "level": "meso", "role": "shell", "importance": 0.6, "confidence": 0.8, "primitive": "plane-card", "topologyClass": "assembled-solid", "topologyRationale": "Collar/lapel panel L (dark, embroidered) is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "bevel", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "torso", "attachment": null, "dimensions": {"width": 0.16, "height": 0.3, "depth": 0.02, "units": "relative", "confidence": 0.8}, "transform": {"position": [-0.12, 0.28, 0.17], "rotation": [0, 0, 0], "scale": [0.16, 0.3, 0.02]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "collar-lapel-l", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "collarSilk"}}, "material": "collarSilk", "materialLayers": ["collarSilk"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["collarPanel.embroideryMask"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Black panel with lighter gold-thread dragon/cloud embroidery, thin gold piping edge."}, "evidenceRefs": ["zones/collar-lapel.png"], "details": [], "fidelityTier": "blockout"};
  node_collar_lapel_l_3.userData.actionProfile = {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "collar-lapel-l", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "collarSilk"}};
  (nodes["torso"] ?? root).add(node_collar_lapel_l_3);
  nodes["collar-lapel-l"] = node_collar_lapel_l_3;
  const mesh_collar_lapel_l_3Geometry = endpoint_collar_lapel_l_3
    ? new THREE.CylinderGeometry(endpoint_collar_lapel_l_3.endRadius, endpoint_collar_lapel_l_3.baseRadius, endpoint_collar_lapel_l_3.length, 32, 12)
    : new THREE.PlaneGeometry(1, 1, 24, 24);
  const mesh_collar_lapel_l_3 = new THREE.Mesh(
    mesh_collar_lapel_l_3Geometry,
    materialMap["collarSilk"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_collar_lapel_l_3.name = "Collar/lapel panel L (dark, embroidered)";
  if (endpoint_collar_lapel_l_3) {
    mesh_collar_lapel_l_3.position.copy(endpoint_collar_lapel_l_3.midpoint);
    mesh_collar_lapel_l_3.quaternion.copy(endpoint_collar_lapel_l_3.quaternion);
  }
  mesh_collar_lapel_l_3.castShadow = options.castShadow ?? true;
  mesh_collar_lapel_l_3.receiveShadow = options.receiveShadow ?? true;
  mesh_collar_lapel_l_3.userData.sculptComponent = {"id": "collar-lapel-l", "name": "Collar/lapel panel L (dark, embroidered)", "level": "meso", "role": "shell", "importance": 0.6, "confidence": 0.8, "primitive": "plane-card", "topologyClass": "assembled-solid", "topologyRationale": "Collar/lapel panel L (dark, embroidered) is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "bevel", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "torso", "attachment": null, "dimensions": {"width": 0.16, "height": 0.3, "depth": 0.02, "units": "relative", "confidence": 0.8}, "transform": {"position": [-0.12, 0.28, 0.17], "rotation": [0, 0, 0], "scale": [0.16, 0.3, 0.02]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "collar-lapel-l", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "collarSilk"}}, "material": "collarSilk", "materialLayers": ["collarSilk"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["collarPanel.embroideryMask"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Black panel with lighter gold-thread dragon/cloud embroidery, thin gold piping edge."}, "evidenceRefs": ["zones/collar-lapel.png"], "details": [], "fidelityTier": "blockout"};
  node_collar_lapel_l_3.add(mesh_collar_lapel_l_3);
  meshes["collar-lapel-l"] = mesh_collar_lapel_l_3;
  colliders["collar-lapel-l"] = {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"};
  destructionGroups["collar-lapel-l"] ??= [];
  destructionGroups["collar-lapel-l"].push(node_collar_lapel_l_3);

  const attachment_collar_lapel_r_4 = null;
  const endpoint_collar_lapel_r_4 = makeAttachmentEndpoint(attachment_collar_lapel_r_4);
  const node_collar_lapel_r_4 = new THREE.Group();
  node_collar_lapel_r_4.name = "Collar/lapel panel R (dark, embroidered)__pivot";
  if (endpoint_collar_lapel_r_4) {
    node_collar_lapel_r_4.position.copy(endpoint_collar_lapel_r_4.start);
    node_collar_lapel_r_4.rotation.set(0, 0, 0);
    node_collar_lapel_r_4.scale.set(1, 1, 1);
  } else {
    node_collar_lapel_r_4.position.set(0.12, 0.28, 0.17);
    node_collar_lapel_r_4.rotation.set(0.0, 0.0, 0.0);
    node_collar_lapel_r_4.scale.set(0.16, 0.3, 0.02);
  }
  node_collar_lapel_r_4.userData.sculptComponent = {"id": "collar-lapel-r", "name": "Collar/lapel panel R (dark, embroidered)", "level": "meso", "role": "shell", "importance": 0.6, "confidence": 0.8, "primitive": "plane-card", "topologyClass": "assembled-solid", "topologyRationale": "Collar/lapel panel R (dark, embroidered) is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "bevel", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "torso", "attachment": null, "dimensions": {"width": 0.16, "height": 0.3, "depth": 0.02, "units": "relative", "confidence": 0.8}, "transform": {"position": [0.12, 0.28, 0.17], "rotation": [0, 0, 0], "scale": [0.16, 0.3, 0.02]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "collar-lapel-r", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "collarSilk"}}, "material": "collarSilk", "materialLayers": ["collarSilk"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["collarPanel.embroideryMask"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Mirrors the left panel across the V-neck opening."}, "evidenceRefs": ["zones/collar-lapel.png"], "details": [], "fidelityTier": "blockout"};
  node_collar_lapel_r_4.userData.actionProfile = {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "collar-lapel-r", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "collarSilk"}};
  (nodes["torso"] ?? root).add(node_collar_lapel_r_4);
  nodes["collar-lapel-r"] = node_collar_lapel_r_4;
  const mesh_collar_lapel_r_4Geometry = endpoint_collar_lapel_r_4
    ? new THREE.CylinderGeometry(endpoint_collar_lapel_r_4.endRadius, endpoint_collar_lapel_r_4.baseRadius, endpoint_collar_lapel_r_4.length, 32, 12)
    : new THREE.PlaneGeometry(1, 1, 24, 24);
  const mesh_collar_lapel_r_4 = new THREE.Mesh(
    mesh_collar_lapel_r_4Geometry,
    materialMap["collarSilk"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_collar_lapel_r_4.name = "Collar/lapel panel R (dark, embroidered)";
  if (endpoint_collar_lapel_r_4) {
    mesh_collar_lapel_r_4.position.copy(endpoint_collar_lapel_r_4.midpoint);
    mesh_collar_lapel_r_4.quaternion.copy(endpoint_collar_lapel_r_4.quaternion);
  }
  mesh_collar_lapel_r_4.castShadow = options.castShadow ?? true;
  mesh_collar_lapel_r_4.receiveShadow = options.receiveShadow ?? true;
  mesh_collar_lapel_r_4.userData.sculptComponent = {"id": "collar-lapel-r", "name": "Collar/lapel panel R (dark, embroidered)", "level": "meso", "role": "shell", "importance": 0.6, "confidence": 0.8, "primitive": "plane-card", "topologyClass": "assembled-solid", "topologyRationale": "Collar/lapel panel R (dark, embroidered) is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "bevel", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "torso", "attachment": null, "dimensions": {"width": 0.16, "height": 0.3, "depth": 0.02, "units": "relative", "confidence": 0.8}, "transform": {"position": [0.12, 0.28, 0.17], "rotation": [0, 0, 0], "scale": [0.16, 0.3, 0.02]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "collar-lapel-r", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "collarSilk"}}, "material": "collarSilk", "materialLayers": ["collarSilk"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["collarPanel.embroideryMask"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Mirrors the left panel across the V-neck opening."}, "evidenceRefs": ["zones/collar-lapel.png"], "details": [], "fidelityTier": "blockout"};
  node_collar_lapel_r_4.add(mesh_collar_lapel_r_4);
  meshes["collar-lapel-r"] = mesh_collar_lapel_r_4;
  colliders["collar-lapel-r"] = {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"};
  destructionGroups["collar-lapel-r"] ??= [];
  destructionGroups["collar-lapel-r"].push(node_collar_lapel_r_4);

  const attachment_arm_l_5 = null;
  const endpoint_arm_l_5 = makeAttachmentEndpoint(attachment_arm_l_5);
  const node_arm_l_5 = new THREE.Group();
  node_arm_l_5.name = "Sleeve \u2014 upper arm L (wide silk drape)__pivot";
  if (endpoint_arm_l_5) {
    node_arm_l_5.position.copy(endpoint_arm_l_5.start);
    node_arm_l_5.rotation.set(0, 0, 0);
    node_arm_l_5.scale.set(1, 1, 1);
  } else {
    node_arm_l_5.position.set(-0.34, 0.15, 0.05);
    node_arm_l_5.rotation.set(0.0, 0.0, 0.25);
    node_arm_l_5.scale.set(0.22, 0.42, 0.22);
  }
  node_arm_l_5.userData.sculptComponent = {"id": "arm-l", "name": "Sleeve — upper arm L (wide silk drape)", "level": "meso", "role": "arm", "importance": 0.7, "confidence": 0.45, "primitive": "capsule", "topologyClass": "assembled-solid", "topologyRationale": "Upper arm L is a discrete primitive body part assembled onto the humanoid rig, not a continuous sculpt or shell.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.22, "height": 0.42, "depth": 0.22, "units": "relative", "confidence": 0.7}, "transform": {"position": [-0.34, 0.15, 0.05], "rotation": [0, 0, 0.25], "scale": [0.22, 0.42, 0.22]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "arm-l", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "shirt"}}, "material": "robeSilk", "materialLayers": ["robeSilk"], "deformations": [], "joints": [], "seams": [], "localFeatures": [], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Camera-far sleeve; mirrored from the visible right sleeve at lower confidence (occluded/edge-of-frame in the reference)."}, "evidenceRefs": ["full-object"], "details": [], "fidelityTier": "blockout"};
  node_arm_l_5.userData.actionProfile = {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "arm-l", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "shirt"}};
  (nodes["root"] ?? root).add(node_arm_l_5);
  nodes["arm-l"] = node_arm_l_5;
  const mesh_arm_l_5Geometry = endpoint_arm_l_5
    ? new THREE.CylinderGeometry(endpoint_arm_l_5.endRadius, endpoint_arm_l_5.baseRadius, endpoint_arm_l_5.length, 32, 12)
    : new THREE.CapsuleGeometry(0.35, 0.7, 16, 32);
  const mesh_arm_l_5 = new THREE.Mesh(
    mesh_arm_l_5Geometry,
    materialMap["robeSilk"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_arm_l_5.name = "Sleeve \u2014 upper arm L (wide silk drape)";
  if (endpoint_arm_l_5) {
    mesh_arm_l_5.position.copy(endpoint_arm_l_5.midpoint);
    mesh_arm_l_5.quaternion.copy(endpoint_arm_l_5.quaternion);
  }
  mesh_arm_l_5.castShadow = options.castShadow ?? true;
  mesh_arm_l_5.receiveShadow = options.receiveShadow ?? true;
  mesh_arm_l_5.userData.sculptComponent = {"id": "arm-l", "name": "Sleeve — upper arm L (wide silk drape)", "level": "meso", "role": "arm", "importance": 0.7, "confidence": 0.45, "primitive": "capsule", "topologyClass": "assembled-solid", "topologyRationale": "Upper arm L is a discrete primitive body part assembled onto the humanoid rig, not a continuous sculpt or shell.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.22, "height": 0.42, "depth": 0.22, "units": "relative", "confidence": 0.7}, "transform": {"position": [-0.34, 0.15, 0.05], "rotation": [0, 0, 0.25], "scale": [0.22, 0.42, 0.22]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "arm-l", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "shirt"}}, "material": "robeSilk", "materialLayers": ["robeSilk"], "deformations": [], "joints": [], "seams": [], "localFeatures": [], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Camera-far sleeve; mirrored from the visible right sleeve at lower confidence (occluded/edge-of-frame in the reference)."}, "evidenceRefs": ["full-object"], "details": [], "fidelityTier": "blockout"};
  node_arm_l_5.add(mesh_arm_l_5);
  meshes["arm-l"] = mesh_arm_l_5;
  colliders["arm-l"] = {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"};
  destructionGroups["arm-l"] ??= [];
  destructionGroups["arm-l"].push(node_arm_l_5);

  const attachment_arm_r_6 = null;
  const endpoint_arm_r_6 = makeAttachmentEndpoint(attachment_arm_r_6);
  const node_arm_r_6 = new THREE.Group();
  node_arm_r_6.name = "Sleeve \u2014 upper arm R (wide silk drape)__pivot";
  if (endpoint_arm_r_6) {
    node_arm_r_6.position.copy(endpoint_arm_r_6.start);
    node_arm_r_6.rotation.set(0, 0, 0);
    node_arm_r_6.scale.set(1, 1, 1);
  } else {
    node_arm_r_6.position.set(0.34, 0.15, 0.05);
    node_arm_r_6.rotation.set(0.0, 0.0, -0.25);
    node_arm_r_6.scale.set(0.22, 0.42, 0.22);
  }
  node_arm_r_6.userData.sculptComponent = {"id": "arm-r", "name": "Sleeve — upper arm R (wide silk drape)", "level": "meso", "role": "arm", "importance": 0.7, "confidence": 0.7, "primitive": "capsule", "topologyClass": "assembled-solid", "topologyRationale": "Upper arm R is a discrete primitive body part assembled onto the humanoid rig, not a continuous sculpt or shell.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.22, "height": 0.42, "depth": 0.22, "units": "relative", "confidence": 0.7}, "transform": {"position": [0.34, 0.15, 0.05], "rotation": [0, 0, -0.25], "scale": [0.22, 0.42, 0.22]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "arm-r", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "shirt"}}, "material": "robeSilk", "materialLayers": ["robeSilk"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["rightSleeve.drape"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Balloons outward with rounded fold volume typical of wide traditional sleeves; gold dragon embroidery continues from torso."}, "evidenceRefs": ["zones/right-sleeve.png"], "details": [], "fidelityTier": "blockout"};
  node_arm_r_6.userData.actionProfile = {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "arm-r", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "shirt"}};
  (nodes["root"] ?? root).add(node_arm_r_6);
  nodes["arm-r"] = node_arm_r_6;
  const mesh_arm_r_6Geometry = endpoint_arm_r_6
    ? new THREE.CylinderGeometry(endpoint_arm_r_6.endRadius, endpoint_arm_r_6.baseRadius, endpoint_arm_r_6.length, 32, 12)
    : new THREE.CapsuleGeometry(0.35, 0.7, 16, 32);
  const mesh_arm_r_6 = new THREE.Mesh(
    mesh_arm_r_6Geometry,
    materialMap["robeSilk"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_arm_r_6.name = "Sleeve \u2014 upper arm R (wide silk drape)";
  if (endpoint_arm_r_6) {
    mesh_arm_r_6.position.copy(endpoint_arm_r_6.midpoint);
    mesh_arm_r_6.quaternion.copy(endpoint_arm_r_6.quaternion);
  }
  mesh_arm_r_6.castShadow = options.castShadow ?? true;
  mesh_arm_r_6.receiveShadow = options.receiveShadow ?? true;
  mesh_arm_r_6.userData.sculptComponent = {"id": "arm-r", "name": "Sleeve — upper arm R (wide silk drape)", "level": "meso", "role": "arm", "importance": 0.7, "confidence": 0.7, "primitive": "capsule", "topologyClass": "assembled-solid", "topologyRationale": "Upper arm R is a discrete primitive body part assembled onto the humanoid rig, not a continuous sculpt or shell.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.22, "height": 0.42, "depth": 0.22, "units": "relative", "confidence": 0.7}, "transform": {"position": [0.34, 0.15, 0.05], "rotation": [0, 0, -0.25], "scale": [0.22, 0.42, 0.22]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "arm-r", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "shirt"}}, "material": "robeSilk", "materialLayers": ["robeSilk"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["rightSleeve.drape"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Balloons outward with rounded fold volume typical of wide traditional sleeves; gold dragon embroidery continues from torso."}, "evidenceRefs": ["zones/right-sleeve.png"], "details": [], "fidelityTier": "blockout"};
  node_arm_r_6.add(mesh_arm_r_6);
  meshes["arm-r"] = mesh_arm_r_6;
  colliders["arm-r"] = {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"};
  destructionGroups["arm-r"] ??= [];
  destructionGroups["arm-r"].push(node_arm_r_6);

  const attachment_neck_7 = null;
  const endpoint_neck_7 = makeAttachmentEndpoint(attachment_neck_7);
  const node_neck_7 = new THREE.Group();
  node_neck_7.name = "Neck__pivot";
  if (endpoint_neck_7) {
    node_neck_7.position.copy(endpoint_neck_7.start);
    node_neck_7.rotation.set(0, 0, 0);
    node_neck_7.scale.set(1, 1, 1);
  } else {
    node_neck_7.position.set(0.0, 0.62, 0.0);
    node_neck_7.rotation.set(0.0, 0.0, 0.0);
    node_neck_7.scale.set(0.11, 0.09, 0.11);
  }
  node_neck_7.userData.sculptComponent = {"id": "neck", "name": "Neck", "level": "meso", "role": "support", "importance": 0.6, "confidence": 0.8, "primitive": "cylinder", "topologyClass": "assembled-solid", "topologyRationale": "Neck is a discrete primitive body part assembled onto the humanoid rig, not a continuous sculpt or shell.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.11, "height": 0.09, "depth": 0.11, "units": "relative", "confidence": 0.7}, "transform": {"position": [0, 0.62, 0.0], "rotation": [0, 0, 0], "scale": [0.11, 0.09, 0.11]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "neck", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "skin"}}, "material": "skin", "materialLayers": ["skin"], "deformations": [], "joints": [], "seams": [], "localFeatures": [], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": ""}, "evidenceRefs": ["full-object"], "details": [], "fidelityTier": "blockout"};
  node_neck_7.userData.actionProfile = {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "neck", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "skin"}};
  (nodes["root"] ?? root).add(node_neck_7);
  nodes["neck"] = node_neck_7;
  const mesh_neck_7Geometry = endpoint_neck_7
    ? new THREE.CylinderGeometry(endpoint_neck_7.endRadius, endpoint_neck_7.baseRadius, endpoint_neck_7.length, 32, 12)
    : new THREE.CylinderGeometry(0.5, 0.5, 1, 48, 16);
  const mesh_neck_7 = new THREE.Mesh(
    mesh_neck_7Geometry,
    materialMap["skin"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_neck_7.name = "Neck";
  if (endpoint_neck_7) {
    mesh_neck_7.position.copy(endpoint_neck_7.midpoint);
    mesh_neck_7.quaternion.copy(endpoint_neck_7.quaternion);
  }
  mesh_neck_7.castShadow = options.castShadow ?? true;
  mesh_neck_7.receiveShadow = options.receiveShadow ?? true;
  mesh_neck_7.userData.sculptComponent = {"id": "neck", "name": "Neck", "level": "meso", "role": "support", "importance": 0.6, "confidence": 0.8, "primitive": "cylinder", "topologyClass": "assembled-solid", "topologyRationale": "Neck is a discrete primitive body part assembled onto the humanoid rig, not a continuous sculpt or shell.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.11, "height": 0.09, "depth": 0.11, "units": "relative", "confidence": 0.7}, "transform": {"position": [0, 0.62, 0.0], "rotation": [0, 0, 0], "scale": [0.11, 0.09, 0.11]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "neck", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "skin"}}, "material": "skin", "materialLayers": ["skin"], "deformations": [], "joints": [], "seams": [], "localFeatures": [], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": ""}, "evidenceRefs": ["full-object"], "details": [], "fidelityTier": "blockout"};
  node_neck_7.add(mesh_neck_7);
  meshes["neck"] = mesh_neck_7;
  colliders["neck"] = {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"};
  destructionGroups["neck"] ??= [];
  destructionGroups["neck"].push(node_neck_7);

  const attachment_head_8 = null;
  const endpoint_head_8 = makeAttachmentEndpoint(attachment_head_8);
  const node_head_8 = new THREE.Group();
  node_head_8.name = "Head__pivot";
  if (endpoint_head_8) {
    node_head_8.position.copy(endpoint_head_8.start);
    node_head_8.rotation.set(0, 0, 0);
    node_head_8.scale.set(1, 1, 1);
  } else {
    node_head_8.position.set(0.0, 0.7000000000000001, 0.005600000000000001);
    node_head_8.rotation.set(0.0, 0.0, 0.0);
    node_head_8.scale.set(0.25760000000000005, 0.31360000000000005, 0.27440000000000003);
  }
  node_head_8.userData.sculptComponent = {"id": "head", "name": "Head", "level": "macro", "role": "body", "importance": 1.0, "confidence": 0.8, "primitive": "ellipsoid", "topologyClass": "assembled-solid", "topologyRationale": "Head is a discrete primitive body part assembled onto the humanoid rig, not a continuous sculpt or shell.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.25760000000000005, "height": 0.31360000000000005, "depth": 0.27440000000000003, "units": "relative", "confidence": 0.8}, "transform": {"position": [0, 0.7000000000000001, 0.005600000000000001], "rotation": [0, 0, 0], "scale": [0.25760000000000005, 0.31360000000000005, 0.27440000000000003]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "head", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "skin"}}, "material": "skin", "materialLayers": ["skin"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["head.faceWrinkles"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Deep forehead furrows (3 horizontal creases), crow's-feet at eye corners, calm faint smile per detail inventory 'face'."}, "evidenceRefs": ["zones/face.png"], "details": [], "fidelityTier": "blockout"};
  node_head_8.userData.actionProfile = {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "head", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "skin"}};
  (nodes["root"] ?? root).add(node_head_8);
  nodes["head"] = node_head_8;
  const mesh_head_8Geometry = endpoint_head_8
    ? new THREE.CylinderGeometry(endpoint_head_8.endRadius, endpoint_head_8.baseRadius, endpoint_head_8.length, 32, 12)
    : new THREE.SphereGeometry(0.5, 64, 40);
  const mesh_head_8 = new THREE.Mesh(
    mesh_head_8Geometry,
    materialMap["skin"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_head_8.name = "Head";
  if (endpoint_head_8) {
    mesh_head_8.position.copy(endpoint_head_8.midpoint);
    mesh_head_8.quaternion.copy(endpoint_head_8.quaternion);
  }
  mesh_head_8.castShadow = options.castShadow ?? true;
  mesh_head_8.receiveShadow = options.receiveShadow ?? true;
  mesh_head_8.userData.sculptComponent = {"id": "head", "name": "Head", "level": "macro", "role": "body", "importance": 1.0, "confidence": 0.8, "primitive": "ellipsoid", "topologyClass": "assembled-solid", "topologyRationale": "Head is a discrete primitive body part assembled onto the humanoid rig, not a continuous sculpt or shell.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.25760000000000005, "height": 0.31360000000000005, "depth": 0.27440000000000003, "units": "relative", "confidence": 0.8}, "transform": {"position": [0, 0.7000000000000001, 0.005600000000000001], "rotation": [0, 0, 0], "scale": [0.25760000000000005, 0.31360000000000005, 0.27440000000000003]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "head", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "skin"}}, "material": "skin", "materialLayers": ["skin"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["head.faceWrinkles"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Deep forehead furrows (3 horizontal creases), crow's-feet at eye corners, calm faint smile per detail inventory 'face'."}, "evidenceRefs": ["zones/face.png"], "details": [], "fidelityTier": "blockout"};
  node_head_8.add(mesh_head_8);
  meshes["head"] = mesh_head_8;
  colliders["head"] = {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"};
  destructionGroups["head"] ??= [];
  destructionGroups["head"].push(node_head_8);

  const attachment_hair_9 = null;
  const endpoint_hair_9 = makeAttachmentEndpoint(attachment_hair_9);
  const node_hair_9 = new THREE.Group();
  node_hair_9.name = "Hair fringe (temple/sideburn, mostly covered by cap)__pivot";
  if (endpoint_hair_9) {
    node_hair_9.position.copy(endpoint_hair_9.start);
    node_hair_9.rotation.set(0, 0, 0);
    node_hair_9.scale.set(1, 1, 1);
  } else {
    node_hair_9.position.set(0.0, 0.58, 0.0);
    node_hair_9.rotation.set(0.0, 0.0, 0.0);
    node_hair_9.scale.set(0.27, 0.1, 0.27);
  }
  node_hair_9.userData.sculptComponent = {"id": "hair", "name": "Hair fringe (temple/sideburn, mostly covered by cap)", "level": "meso", "role": "hair", "importance": 0.9, "confidence": 0.5, "primitive": "ellipsoid", "topologyClass": "assembled-solid", "topologyRationale": "Hair (side-swept) is a discrete primitive body part assembled onto the humanoid rig, not a continuous sculpt or shell.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.27, "height": 0.1, "depth": 0.27, "units": "relative", "confidence": 0.5}, "transform": {"position": [0, 0.58, 0.0], "rotation": [0, 0, 0], "scale": [0.27, 0.1, 0.27]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "hair", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "hair"}}, "material": "hair", "materialLayers": ["hair"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["short sides, longer swept-back top"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Hairline itself is hidden by the cap (unmeasurable); only grey sideburn wisps at the temple are visible."}, "evidenceRefs": ["full-object"], "details": [], "fidelityTier": "blockout"};
  node_hair_9.userData.actionProfile = {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "hair", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "hair"}};
  (nodes["root"] ?? root).add(node_hair_9);
  nodes["hair"] = node_hair_9;
  const mesh_hair_9Geometry = endpoint_hair_9
    ? new THREE.CylinderGeometry(endpoint_hair_9.endRadius, endpoint_hair_9.baseRadius, endpoint_hair_9.length, 32, 12)
    : new THREE.SphereGeometry(0.5, 64, 40);
  const mesh_hair_9 = new THREE.Mesh(
    mesh_hair_9Geometry,
    materialMap["hair"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_hair_9.name = "Hair fringe (temple/sideburn, mostly covered by cap)";
  if (endpoint_hair_9) {
    mesh_hair_9.position.copy(endpoint_hair_9.midpoint);
    mesh_hair_9.quaternion.copy(endpoint_hair_9.quaternion);
  }
  mesh_hair_9.castShadow = options.castShadow ?? true;
  mesh_hair_9.receiveShadow = options.receiveShadow ?? true;
  mesh_hair_9.userData.sculptComponent = {"id": "hair", "name": "Hair fringe (temple/sideburn, mostly covered by cap)", "level": "meso", "role": "hair", "importance": 0.9, "confidence": 0.5, "primitive": "ellipsoid", "topologyClass": "assembled-solid", "topologyRationale": "Hair (side-swept) is a discrete primitive body part assembled onto the humanoid rig, not a continuous sculpt or shell.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.27, "height": 0.1, "depth": 0.27, "units": "relative", "confidence": 0.5}, "transform": {"position": [0, 0.58, 0.0], "rotation": [0, 0, 0], "scale": [0.27, 0.1, 0.27]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "hair", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "hair"}}, "material": "hair", "materialLayers": ["hair"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["short sides, longer swept-back top"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Hairline itself is hidden by the cap (unmeasurable); only grey sideburn wisps at the temple are visible."}, "evidenceRefs": ["full-object"], "details": [], "fidelityTier": "blockout"};
  node_hair_9.add(mesh_hair_9);
  meshes["hair"] = mesh_hair_9;
  colliders["hair"] = {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"};
  destructionGroups["hair"] ??= [];
  destructionGroups["hair"].push(node_hair_9);

  const attachment_brow_l_10 = null;
  const endpoint_brow_l_10 = makeAttachmentEndpoint(attachment_brow_l_10);
  const node_brow_l_10 = new THREE.Group();
  node_brow_l_10.name = "Eyebrow L__pivot";
  if (endpoint_brow_l_10) {
    node_brow_l_10.position.copy(endpoint_brow_l_10.start);
    node_brow_l_10.rotation.set(0, 0, 0);
    node_brow_l_10.scale.set(1, 1, 1);
  } else {
    node_brow_l_10.position.set(0.05600000000000001, 0.7336, 0.13440000000000002);
    node_brow_l_10.rotation.set(0.0, 0.0, 0.0);
    node_brow_l_10.scale.set(0.06160000000000001, 0.011200000000000002, 0.016800000000000002);
  }
  node_brow_l_10.userData.sculptComponent = {"id": "brow-l", "name": "Eyebrow L", "level": "micro", "role": "detail", "importance": 0.4, "confidence": 0.8, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Eyebrow L is a discrete primitive body part assembled onto the humanoid rig, not a continuous sculpt or shell.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.06160000000000001, "height": 0.011200000000000002, "depth": 0.016800000000000002, "units": "relative", "confidence": 0.8}, "transform": {"position": [0.05600000000000001, 0.7336, 0.13440000000000002], "rotation": [0, 0, 0], "scale": [0.06160000000000001, 0.011200000000000002, 0.016800000000000002]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "brow-l", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "hair"}}, "material": "hair", "materialLayers": ["hair"], "deformations": [], "joints": [], "seams": [], "localFeatures": [], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Grey/dark eyebrow, slight downward-angled outer end matching calm expression."}, "evidenceRefs": ["full-object"], "details": [], "fidelityTier": "blockout"};
  node_brow_l_10.userData.actionProfile = {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "brow-l", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "hair"}};
  (nodes["root"] ?? root).add(node_brow_l_10);
  nodes["brow-l"] = node_brow_l_10;
  const mesh_brow_l_10Geometry = endpoint_brow_l_10
    ? new THREE.CylinderGeometry(endpoint_brow_l_10.endRadius, endpoint_brow_l_10.baseRadius, endpoint_brow_l_10.length, 32, 12)
    : new THREE.BoxGeometry(1, 1, 1, 12, 12, 12);
  const mesh_brow_l_10 = new THREE.Mesh(
    mesh_brow_l_10Geometry,
    materialMap["hair"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_brow_l_10.name = "Eyebrow L";
  if (endpoint_brow_l_10) {
    mesh_brow_l_10.position.copy(endpoint_brow_l_10.midpoint);
    mesh_brow_l_10.quaternion.copy(endpoint_brow_l_10.quaternion);
  }
  mesh_brow_l_10.castShadow = options.castShadow ?? true;
  mesh_brow_l_10.receiveShadow = options.receiveShadow ?? true;
  mesh_brow_l_10.userData.sculptComponent = {"id": "brow-l", "name": "Eyebrow L", "level": "micro", "role": "detail", "importance": 0.4, "confidence": 0.8, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Eyebrow L is a discrete primitive body part assembled onto the humanoid rig, not a continuous sculpt or shell.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.06160000000000001, "height": 0.011200000000000002, "depth": 0.016800000000000002, "units": "relative", "confidence": 0.8}, "transform": {"position": [0.05600000000000001, 0.7336, 0.13440000000000002], "rotation": [0, 0, 0], "scale": [0.06160000000000001, 0.011200000000000002, 0.016800000000000002]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "brow-l", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "hair"}}, "material": "hair", "materialLayers": ["hair"], "deformations": [], "joints": [], "seams": [], "localFeatures": [], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Grey/dark eyebrow, slight downward-angled outer end matching calm expression."}, "evidenceRefs": ["full-object"], "details": [], "fidelityTier": "blockout"};
  node_brow_l_10.add(mesh_brow_l_10);
  meshes["brow-l"] = mesh_brow_l_10;
  colliders["brow-l"] = {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"};
  destructionGroups["brow-l"] ??= [];
  destructionGroups["brow-l"].push(node_brow_l_10);

  const attachment_brow_r_11 = null;
  const endpoint_brow_r_11 = makeAttachmentEndpoint(attachment_brow_r_11);
  const node_brow_r_11 = new THREE.Group();
  node_brow_r_11.name = "Eyebrow R__pivot";
  if (endpoint_brow_r_11) {
    node_brow_r_11.position.copy(endpoint_brow_r_11.start);
    node_brow_r_11.rotation.set(0, 0, 0);
    node_brow_r_11.scale.set(1, 1, 1);
  } else {
    node_brow_r_11.position.set(-0.05600000000000001, 0.7336, 0.13440000000000002);
    node_brow_r_11.rotation.set(0.0, 0.0, 0.0);
    node_brow_r_11.scale.set(0.06160000000000001, 0.011200000000000002, 0.016800000000000002);
  }
  node_brow_r_11.userData.sculptComponent = {"id": "brow-r", "name": "Eyebrow R", "level": "micro", "role": "detail", "importance": 0.4, "confidence": 0.8, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Eyebrow R is a discrete primitive body part assembled onto the humanoid rig, not a continuous sculpt or shell.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.06160000000000001, "height": 0.011200000000000002, "depth": 0.016800000000000002, "units": "relative", "confidence": 0.8}, "transform": {"position": [-0.05600000000000001, 0.7336, 0.13440000000000002], "rotation": [0, 0, 0], "scale": [0.06160000000000001, 0.011200000000000002, 0.016800000000000002]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "brow-r", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "hair"}}, "material": "hair", "materialLayers": ["hair"], "deformations": [], "joints": [], "seams": [], "localFeatures": [], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Grey/dark eyebrow, slight downward-angled outer end matching calm expression."}, "evidenceRefs": ["full-object"], "details": [], "fidelityTier": "blockout"};
  node_brow_r_11.userData.actionProfile = {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "brow-r", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "hair"}};
  (nodes["root"] ?? root).add(node_brow_r_11);
  nodes["brow-r"] = node_brow_r_11;
  const mesh_brow_r_11Geometry = endpoint_brow_r_11
    ? new THREE.CylinderGeometry(endpoint_brow_r_11.endRadius, endpoint_brow_r_11.baseRadius, endpoint_brow_r_11.length, 32, 12)
    : new THREE.BoxGeometry(1, 1, 1, 12, 12, 12);
  const mesh_brow_r_11 = new THREE.Mesh(
    mesh_brow_r_11Geometry,
    materialMap["hair"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_brow_r_11.name = "Eyebrow R";
  if (endpoint_brow_r_11) {
    mesh_brow_r_11.position.copy(endpoint_brow_r_11.midpoint);
    mesh_brow_r_11.quaternion.copy(endpoint_brow_r_11.quaternion);
  }
  mesh_brow_r_11.castShadow = options.castShadow ?? true;
  mesh_brow_r_11.receiveShadow = options.receiveShadow ?? true;
  mesh_brow_r_11.userData.sculptComponent = {"id": "brow-r", "name": "Eyebrow R", "level": "micro", "role": "detail", "importance": 0.4, "confidence": 0.8, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Eyebrow R is a discrete primitive body part assembled onto the humanoid rig, not a continuous sculpt or shell.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.06160000000000001, "height": 0.011200000000000002, "depth": 0.016800000000000002, "units": "relative", "confidence": 0.8}, "transform": {"position": [-0.05600000000000001, 0.7336, 0.13440000000000002], "rotation": [0, 0, 0], "scale": [0.06160000000000001, 0.011200000000000002, 0.016800000000000002]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "brow-r", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "hair"}}, "material": "hair", "materialLayers": ["hair"], "deformations": [], "joints": [], "seams": [], "localFeatures": [], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Grey/dark eyebrow, slight downward-angled outer end matching calm expression."}, "evidenceRefs": ["full-object"], "details": [], "fidelityTier": "blockout"};
  node_brow_r_11.add(mesh_brow_r_11);
  meshes["brow-r"] = mesh_brow_r_11;
  colliders["brow-r"] = {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"};
  destructionGroups["brow-r"] ??= [];
  destructionGroups["brow-r"].push(node_brow_r_11);

  const attachment_eye_l_12 = null;
  const endpoint_eye_l_12 = makeAttachmentEndpoint(attachment_eye_l_12);
  const node_eye_l_12 = new THREE.Group();
  node_eye_l_12.name = "Eye L (sclera + iris + catchlight)__pivot";
  if (endpoint_eye_l_12) {
    node_eye_l_12.position.copy(endpoint_eye_l_12.start);
    node_eye_l_12.rotation.set(0, 0, 0);
    node_eye_l_12.scale.set(1, 1, 1);
  } else {
    node_eye_l_12.position.set(-0.07, 0.735, 0.125);
    node_eye_l_12.rotation.set(0.0, 0.0, 0.0);
    node_eye_l_12.scale.set(0.035, 0.035, 0.035);
  }
  node_eye_l_12.userData.sculptComponent = {"id": "eye-l", "name": "Eye L (sclera + iris + catchlight)", "level": "micro", "role": "detail", "importance": 0.5, "confidence": 0.6, "primitive": "sphere", "topologyClass": "assembled-solid", "topologyRationale": "Eye L (sclera + iris + catchlight) is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.035, "height": 0.035, "depth": 0.035, "units": "relative", "confidence": 0.6}, "transform": {"position": [-0.07, 0.735, 0.125], "rotation": [0, 0, 0], "scale": [0.035, 0.035, 0.035]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "eye-l", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "eyeWhite"}}, "material": "eyeWhite", "materialLayers": ["eyeWhite"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["head.eyes"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Glossy sphere, low roughness; narrow heavy-lidded shape read from the eyelid geometry, not the sphere itself."}, "evidenceRefs": ["zones/face.png"], "details": [], "fidelityTier": "blockout"};
  node_eye_l_12.userData.actionProfile = {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "eye-l", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "eyeWhite"}};
  (nodes["root"] ?? root).add(node_eye_l_12);
  nodes["eye-l"] = node_eye_l_12;
  const mesh_eye_l_12Geometry = endpoint_eye_l_12
    ? new THREE.CylinderGeometry(endpoint_eye_l_12.endRadius, endpoint_eye_l_12.baseRadius, endpoint_eye_l_12.length, 32, 12)
    : new THREE.SphereGeometry(0.5, 64, 40);
  const mesh_eye_l_12 = new THREE.Mesh(
    mesh_eye_l_12Geometry,
    materialMap["eyeWhite"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_eye_l_12.name = "Eye L (sclera + iris + catchlight)";
  if (endpoint_eye_l_12) {
    mesh_eye_l_12.position.copy(endpoint_eye_l_12.midpoint);
    mesh_eye_l_12.quaternion.copy(endpoint_eye_l_12.quaternion);
  }
  mesh_eye_l_12.castShadow = options.castShadow ?? true;
  mesh_eye_l_12.receiveShadow = options.receiveShadow ?? true;
  mesh_eye_l_12.userData.sculptComponent = {"id": "eye-l", "name": "Eye L (sclera + iris + catchlight)", "level": "micro", "role": "detail", "importance": 0.5, "confidence": 0.6, "primitive": "sphere", "topologyClass": "assembled-solid", "topologyRationale": "Eye L (sclera + iris + catchlight) is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.035, "height": 0.035, "depth": 0.035, "units": "relative", "confidence": 0.6}, "transform": {"position": [-0.07, 0.735, 0.125], "rotation": [0, 0, 0], "scale": [0.035, 0.035, 0.035]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "eye-l", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "eyeWhite"}}, "material": "eyeWhite", "materialLayers": ["eyeWhite"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["head.eyes"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Glossy sphere, low roughness; narrow heavy-lidded shape read from the eyelid geometry, not the sphere itself."}, "evidenceRefs": ["zones/face.png"], "details": [], "fidelityTier": "blockout"};
  node_eye_l_12.add(mesh_eye_l_12);
  meshes["eye-l"] = mesh_eye_l_12;
  colliders["eye-l"] = {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"};
  destructionGroups["eye-l"] ??= [];
  destructionGroups["eye-l"].push(node_eye_l_12);

  const attachment_eye_r_13 = null;
  const endpoint_eye_r_13 = makeAttachmentEndpoint(attachment_eye_r_13);
  const node_eye_r_13 = new THREE.Group();
  node_eye_r_13.name = "Eye R (sclera + iris + catchlight)__pivot";
  if (endpoint_eye_r_13) {
    node_eye_r_13.position.copy(endpoint_eye_r_13.start);
    node_eye_r_13.rotation.set(0, 0, 0);
    node_eye_r_13.scale.set(1, 1, 1);
  } else {
    node_eye_r_13.position.set(0.07, 0.735, 0.125);
    node_eye_r_13.rotation.set(0.0, 0.0, 0.0);
    node_eye_r_13.scale.set(0.035, 0.035, 0.035);
  }
  node_eye_r_13.userData.sculptComponent = {"id": "eye-r", "name": "Eye R (sclera + iris + catchlight)", "level": "micro", "role": "detail", "importance": 0.5, "confidence": 0.6, "primitive": "sphere", "topologyClass": "assembled-solid", "topologyRationale": "Eye R (sclera + iris + catchlight) is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.035, "height": 0.035, "depth": 0.035, "units": "relative", "confidence": 0.6}, "transform": {"position": [0.07, 0.735, 0.125], "rotation": [0, 0, 0], "scale": [0.035, 0.035, 0.035]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "eye-r", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "eyeWhite"}}, "material": "eyeWhite", "materialLayers": ["eyeWhite"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["head.eyes"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Small warm rim highlight on the lower lid; no strong catchlight in the reference's soft overcast key light."}, "evidenceRefs": ["zones/face.png"], "details": [], "fidelityTier": "blockout"};
  node_eye_r_13.userData.actionProfile = {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "eye-r", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "eyeWhite"}};
  (nodes["root"] ?? root).add(node_eye_r_13);
  nodes["eye-r"] = node_eye_r_13;
  const mesh_eye_r_13Geometry = endpoint_eye_r_13
    ? new THREE.CylinderGeometry(endpoint_eye_r_13.endRadius, endpoint_eye_r_13.baseRadius, endpoint_eye_r_13.length, 32, 12)
    : new THREE.SphereGeometry(0.5, 64, 40);
  const mesh_eye_r_13 = new THREE.Mesh(
    mesh_eye_r_13Geometry,
    materialMap["eyeWhite"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_eye_r_13.name = "Eye R (sclera + iris + catchlight)";
  if (endpoint_eye_r_13) {
    mesh_eye_r_13.position.copy(endpoint_eye_r_13.midpoint);
    mesh_eye_r_13.quaternion.copy(endpoint_eye_r_13.quaternion);
  }
  mesh_eye_r_13.castShadow = options.castShadow ?? true;
  mesh_eye_r_13.receiveShadow = options.receiveShadow ?? true;
  mesh_eye_r_13.userData.sculptComponent = {"id": "eye-r", "name": "Eye R (sclera + iris + catchlight)", "level": "micro", "role": "detail", "importance": 0.5, "confidence": 0.6, "primitive": "sphere", "topologyClass": "assembled-solid", "topologyRationale": "Eye R (sclera + iris + catchlight) is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.035, "height": 0.035, "depth": 0.035, "units": "relative", "confidence": 0.6}, "transform": {"position": [0.07, 0.735, 0.125], "rotation": [0, 0, 0], "scale": [0.035, 0.035, 0.035]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "eye-r", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "eyeWhite"}}, "material": "eyeWhite", "materialLayers": ["eyeWhite"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["head.eyes"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Small warm rim highlight on the lower lid; no strong catchlight in the reference's soft overcast key light."}, "evidenceRefs": ["zones/face.png"], "details": [], "fidelityTier": "blockout"};
  node_eye_r_13.add(mesh_eye_r_13);
  meshes["eye-r"] = mesh_eye_r_13;
  colliders["eye-r"] = {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"};
  destructionGroups["eye-r"] ??= [];
  destructionGroups["eye-r"].push(node_eye_r_13);

  const attachment_nose_14 = null;
  const endpoint_nose_14 = makeAttachmentEndpoint(attachment_nose_14);
  const node_nose_14 = new THREE.Group();
  node_nose_14.name = "Nose__pivot";
  if (endpoint_nose_14) {
    node_nose_14.position.copy(endpoint_nose_14.start);
    node_nose_14.rotation.set(0, 0, 0);
    node_nose_14.scale.set(1, 1, 1);
  } else {
    node_nose_14.position.set(0.0, 0.6888000000000001, 0.1456);
    node_nose_14.rotation.set(1.4, 0.0, 0.0);
    node_nose_14.scale.set(0.039200000000000006, 0.07840000000000001, 0.0504);
  }
  node_nose_14.userData.sculptComponent = {"id": "nose", "name": "Nose", "level": "micro", "role": "detail", "importance": 0.4, "confidence": 0.8, "primitive": "cone", "topologyClass": "assembled-solid", "topologyRationale": "Nose is a discrete primitive body part assembled onto the humanoid rig, not a continuous sculpt or shell.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.039200000000000006, "height": 0.07840000000000001, "depth": 0.0504, "units": "relative", "confidence": 0.8}, "transform": {"position": [0, 0.6888000000000001, 0.1456], "rotation": [1.4, 0, 0], "scale": [0.039200000000000006, 0.07840000000000001, 0.0504]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "nose", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "skin"}}, "material": "skin", "materialLayers": ["skin"], "deformations": [], "joints": [], "seams": [], "localFeatures": [], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": ""}, "evidenceRefs": ["zones/face.png"], "details": [], "fidelityTier": "blockout"};
  node_nose_14.userData.actionProfile = {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "nose", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "skin"}};
  (nodes["root"] ?? root).add(node_nose_14);
  nodes["nose"] = node_nose_14;
  const mesh_nose_14Geometry = endpoint_nose_14
    ? new THREE.CylinderGeometry(endpoint_nose_14.endRadius, endpoint_nose_14.baseRadius, endpoint_nose_14.length, 32, 12)
    : new THREE.ConeGeometry(0.5, 1, 48, 16);
  const mesh_nose_14 = new THREE.Mesh(
    mesh_nose_14Geometry,
    materialMap["skin"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_nose_14.name = "Nose";
  if (endpoint_nose_14) {
    mesh_nose_14.position.copy(endpoint_nose_14.midpoint);
    mesh_nose_14.quaternion.copy(endpoint_nose_14.quaternion);
  }
  mesh_nose_14.castShadow = options.castShadow ?? true;
  mesh_nose_14.receiveShadow = options.receiveShadow ?? true;
  mesh_nose_14.userData.sculptComponent = {"id": "nose", "name": "Nose", "level": "micro", "role": "detail", "importance": 0.4, "confidence": 0.8, "primitive": "cone", "topologyClass": "assembled-solid", "topologyRationale": "Nose is a discrete primitive body part assembled onto the humanoid rig, not a continuous sculpt or shell.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.039200000000000006, "height": 0.07840000000000001, "depth": 0.0504, "units": "relative", "confidence": 0.8}, "transform": {"position": [0, 0.6888000000000001, 0.1456], "rotation": [1.4, 0, 0], "scale": [0.039200000000000006, 0.07840000000000001, 0.0504]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "nose", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "skin"}}, "material": "skin", "materialLayers": ["skin"], "deformations": [], "joints": [], "seams": [], "localFeatures": [], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": ""}, "evidenceRefs": ["zones/face.png"], "details": [], "fidelityTier": "blockout"};
  node_nose_14.add(mesh_nose_14);
  meshes["nose"] = mesh_nose_14;
  colliders["nose"] = {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"};
  destructionGroups["nose"] ??= [];
  destructionGroups["nose"].push(node_nose_14);

  const attachment_mouth_15 = null;
  const endpoint_mouth_15 = makeAttachmentEndpoint(attachment_mouth_15);
  const node_mouth_15 = new THREE.Group();
  node_mouth_15.name = "Mouth__pivot";
  if (endpoint_mouth_15) {
    node_mouth_15.position.copy(endpoint_mouth_15.start);
    node_mouth_15.rotation.set(0, 0, 0);
    node_mouth_15.scale.set(1, 1, 1);
  } else {
    node_mouth_15.position.set(0.0, 0.6048, 0.13440000000000002);
    node_mouth_15.rotation.set(0.0, 0.0, 0.0);
    node_mouth_15.scale.set(0.06720000000000001, 0.011200000000000002, 0.014000000000000002);
  }
  node_mouth_15.userData.sculptComponent = {"id": "mouth", "name": "Mouth", "level": "micro", "role": "detail", "importance": 0.4, "confidence": 0.8, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Mouth is a discrete primitive body part assembled onto the humanoid rig, not a continuous sculpt or shell.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.06720000000000001, "height": 0.011200000000000002, "depth": 0.014000000000000002, "units": "relative", "confidence": 0.8}, "transform": {"position": [0, 0.6048, 0.13440000000000002], "rotation": [0, 0, 0], "scale": [0.06720000000000001, 0.011200000000000002, 0.014000000000000002]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "mouth", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "lips"}}, "material": "skin", "materialLayers": ["skin"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["head.mustacheDroop"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": ""}, "evidenceRefs": ["zones/face.png"], "details": [], "fidelityTier": "blockout"};
  node_mouth_15.userData.actionProfile = {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "mouth", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "lips"}};
  (nodes["root"] ?? root).add(node_mouth_15);
  nodes["mouth"] = node_mouth_15;
  const mesh_mouth_15Geometry = endpoint_mouth_15
    ? new THREE.CylinderGeometry(endpoint_mouth_15.endRadius, endpoint_mouth_15.baseRadius, endpoint_mouth_15.length, 32, 12)
    : new THREE.BoxGeometry(1, 1, 1, 12, 12, 12);
  const mesh_mouth_15 = new THREE.Mesh(
    mesh_mouth_15Geometry,
    materialMap["skin"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_mouth_15.name = "Mouth";
  if (endpoint_mouth_15) {
    mesh_mouth_15.position.copy(endpoint_mouth_15.midpoint);
    mesh_mouth_15.quaternion.copy(endpoint_mouth_15.quaternion);
  }
  mesh_mouth_15.castShadow = options.castShadow ?? true;
  mesh_mouth_15.receiveShadow = options.receiveShadow ?? true;
  mesh_mouth_15.userData.sculptComponent = {"id": "mouth", "name": "Mouth", "level": "micro", "role": "detail", "importance": 0.4, "confidence": 0.8, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Mouth is a discrete primitive body part assembled onto the humanoid rig, not a continuous sculpt or shell.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.06720000000000001, "height": 0.011200000000000002, "depth": 0.014000000000000002, "units": "relative", "confidence": 0.8}, "transform": {"position": [0, 0.6048, 0.13440000000000002], "rotation": [0, 0, 0], "scale": [0.06720000000000001, 0.011200000000000002, 0.014000000000000002]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "mouth", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "lips"}}, "material": "skin", "materialLayers": ["skin"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["head.mustacheDroop"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": ""}, "evidenceRefs": ["zones/face.png"], "details": [], "fidelityTier": "blockout"};
  node_mouth_15.add(mesh_mouth_15);
  meshes["mouth"] = mesh_mouth_15;
  colliders["mouth"] = {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"};
  destructionGroups["mouth"] ??= [];
  destructionGroups["mouth"].push(node_mouth_15);

  const attachment_mustache_16 = null;
  const endpoint_mustache_16 = makeAttachmentEndpoint(attachment_mustache_16);
  const node_mustache_16 = new THREE.Group();
  node_mustache_16.name = "Mustache__pivot";
  if (endpoint_mustache_16) {
    node_mustache_16.position.copy(endpoint_mustache_16.start);
    node_mustache_16.rotation.set(0, 0, 0);
    node_mustache_16.scale.set(1, 1, 1);
  } else {
    node_mustache_16.position.set(0.0, 0.545, 0.15);
    node_mustache_16.rotation.set(0.0, 0.0, 0.0);
    node_mustache_16.scale.set(0.14, 0.03, 0.05);
  }
  node_mustache_16.userData.sculptComponent = {"id": "mustache", "name": "Mustache", "level": "micro", "role": "detail", "importance": 0.3, "confidence": 0.7, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Mustache is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.14, "height": 0.03, "depth": 0.05, "units": "relative", "confidence": 0.7}, "transform": {"position": [0, 0.545, 0.15], "rotation": [0, 0, 0], "scale": [0.14, 0.03, 0.05]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "mustache", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "hair"}}, "material": "hair", "materialLayers": ["hair"], "deformations": [], "joints": [], "seams": [], "localFeatures": [], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Thin grey strands drooping past the mouth corners."}, "evidenceRefs": ["zones/face.png"], "details": [], "fidelityTier": "blockout"};
  node_mustache_16.userData.actionProfile = {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "mustache", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "hair"}};
  (nodes["root"] ?? root).add(node_mustache_16);
  nodes["mustache"] = node_mustache_16;
  const mesh_mustache_16Geometry = endpoint_mustache_16
    ? new THREE.CylinderGeometry(endpoint_mustache_16.endRadius, endpoint_mustache_16.baseRadius, endpoint_mustache_16.length, 32, 12)
    : new THREE.BoxGeometry(1, 1, 1, 12, 12, 12);
  const mesh_mustache_16 = new THREE.Mesh(
    mesh_mustache_16Geometry,
    materialMap["hair"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_mustache_16.name = "Mustache";
  if (endpoint_mustache_16) {
    mesh_mustache_16.position.copy(endpoint_mustache_16.midpoint);
    mesh_mustache_16.quaternion.copy(endpoint_mustache_16.quaternion);
  }
  mesh_mustache_16.castShadow = options.castShadow ?? true;
  mesh_mustache_16.receiveShadow = options.receiveShadow ?? true;
  mesh_mustache_16.userData.sculptComponent = {"id": "mustache", "name": "Mustache", "level": "micro", "role": "detail", "importance": 0.3, "confidence": 0.7, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Mustache is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.14, "height": 0.03, "depth": 0.05, "units": "relative", "confidence": 0.7}, "transform": {"position": [0, 0.545, 0.15], "rotation": [0, 0, 0], "scale": [0.14, 0.03, 0.05]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "mustache", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "hair"}}, "material": "hair", "materialLayers": ["hair"], "deformations": [], "joints": [], "seams": [], "localFeatures": [], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Thin grey strands drooping past the mouth corners."}, "evidenceRefs": ["zones/face.png"], "details": [], "fidelityTier": "blockout"};
  node_mustache_16.add(mesh_mustache_16);
  meshes["mustache"] = mesh_mustache_16;
  colliders["mustache"] = {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"};
  destructionGroups["mustache"] ??= [];
  destructionGroups["mustache"].push(node_mustache_16);

  const attachment_beard_root_17 = null;
  const endpoint_beard_root_17 = makeAttachmentEndpoint(attachment_beard_root_17);
  const node_beard_root_17 = new THREE.Group();
  node_beard_root_17.name = "Beard mass (root, silhouette block)__pivot";
  if (endpoint_beard_root_17) {
    node_beard_root_17.position.copy(endpoint_beard_root_17.start);
    node_beard_root_17.rotation.set(0, 0, 0);
    node_beard_root_17.scale.set(1, 1, 1);
  } else {
    node_beard_root_17.position.set(0.0, 0.42, 0.1);
    node_beard_root_17.rotation.set(0.0, 0.0, 0.0);
    node_beard_root_17.scale.set(0.24, 0.42, 0.16);
  }
  node_beard_root_17.userData.sculptComponent = {"id": "beard-root", "name": "Beard mass (root, silhouette block)", "level": "meso", "role": "shell", "importance": 0.85, "confidence": 0.75, "primitive": "ellipsoid", "topologyClass": "assembled-solid", "topologyRationale": "Beard mass (root, silhouette block) is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "bevel", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.24, "height": 0.42, "depth": 0.16, "units": "relative", "confidence": 0.75}, "transform": {"position": [0, 0.42, 0.1], "rotation": [0, 0, 0], "scale": [0.24, 0.42, 0.16]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "beard-root", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "hair"}}, "material": "hair", "materialLayers": ["hair"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["beard.clumpSystem"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Silhouette block underlying the beard-clump repetition system; center-parted, covers most of the visible collar."}, "evidenceRefs": ["zones/beard.png"], "details": [], "fidelityTier": "blockout"};
  node_beard_root_17.userData.actionProfile = {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "beard-root", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "hair"}};
  (nodes["root"] ?? root).add(node_beard_root_17);
  nodes["beard-root"] = node_beard_root_17;
  const mesh_beard_root_17Geometry = endpoint_beard_root_17
    ? new THREE.CylinderGeometry(endpoint_beard_root_17.endRadius, endpoint_beard_root_17.baseRadius, endpoint_beard_root_17.length, 32, 12)
    : new THREE.SphereGeometry(0.5, 64, 40);
  const mesh_beard_root_17 = new THREE.Mesh(
    mesh_beard_root_17Geometry,
    materialMap["hair"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_beard_root_17.name = "Beard mass (root, silhouette block)";
  if (endpoint_beard_root_17) {
    mesh_beard_root_17.position.copy(endpoint_beard_root_17.midpoint);
    mesh_beard_root_17.quaternion.copy(endpoint_beard_root_17.quaternion);
  }
  mesh_beard_root_17.castShadow = options.castShadow ?? true;
  mesh_beard_root_17.receiveShadow = options.receiveShadow ?? true;
  mesh_beard_root_17.userData.sculptComponent = {"id": "beard-root", "name": "Beard mass (root, silhouette block)", "level": "meso", "role": "shell", "importance": 0.85, "confidence": 0.75, "primitive": "ellipsoid", "topologyClass": "assembled-solid", "topologyRationale": "Beard mass (root, silhouette block) is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "bevel", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.24, "height": 0.42, "depth": 0.16, "units": "relative", "confidence": 0.75}, "transform": {"position": [0, 0.42, 0.1], "rotation": [0, 0, 0], "scale": [0.24, 0.42, 0.16]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "beard-root", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "hair"}}, "material": "hair", "materialLayers": ["hair"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["beard.clumpSystem"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Silhouette block underlying the beard-clump repetition system; center-parted, covers most of the visible collar."}, "evidenceRefs": ["zones/beard.png"], "details": [], "fidelityTier": "blockout"};
  node_beard_root_17.add(mesh_beard_root_17);
  meshes["beard-root"] = mesh_beard_root_17;
  colliders["beard-root"] = {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"};
  destructionGroups["beard-root"] ??= [];
  destructionGroups["beard-root"].push(node_beard_root_17);

  const attachment_cap_18 = null;
  const endpoint_cap_18 = makeAttachmentEndpoint(attachment_cap_18);
  const node_cap_18 = new THREE.Group();
  node_cap_18.name = "Scholar's cap (cylinder body)__pivot";
  if (endpoint_cap_18) {
    node_cap_18.position.copy(endpoint_cap_18.start);
    node_cap_18.rotation.set(0, 0, 0);
    node_cap_18.scale.set(1, 1, 1);
  } else {
    node_cap_18.position.set(0.0, 0.9, 0.0);
    node_cap_18.rotation.set(0.0, 0.0, 0.0);
    node_cap_18.scale.set(0.18, 0.12, 0.18);
  }
  node_cap_18.userData.sculptComponent = {"id": "cap", "name": "Scholar's cap (cylinder body)", "level": "macro", "role": "shell", "importance": 0.9, "confidence": 0.85, "primitive": "cylinder", "topologyClass": "assembled-solid", "topologyRationale": "Scholar's cap (cylinder body) is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "bevel", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.18, "height": 0.12, "depth": 0.18, "units": "relative", "confidence": 0.85}, "transform": {"position": [0, 0.9, 0.0], "rotation": [0, 0, 0], "scale": [0.18, 0.12, 0.18]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "cap", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "cap"}}, "material": "cap", "materialLayers": ["cap"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["cap.frontOrnament"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Red felt/silk cylinder, dark maroon trim band at the base rim."}, "evidenceRefs": ["zones/cap.png"], "details": [], "fidelityTier": "blockout"};
  node_cap_18.userData.actionProfile = {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "cap", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "cap"}};
  (nodes["root"] ?? root).add(node_cap_18);
  nodes["cap"] = node_cap_18;
  const mesh_cap_18Geometry = endpoint_cap_18
    ? new THREE.CylinderGeometry(endpoint_cap_18.endRadius, endpoint_cap_18.baseRadius, endpoint_cap_18.length, 32, 12)
    : new THREE.CylinderGeometry(0.5, 0.5, 1, 48, 16);
  const mesh_cap_18 = new THREE.Mesh(
    mesh_cap_18Geometry,
    materialMap["cap"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_cap_18.name = "Scholar's cap (cylinder body)";
  if (endpoint_cap_18) {
    mesh_cap_18.position.copy(endpoint_cap_18.midpoint);
    mesh_cap_18.quaternion.copy(endpoint_cap_18.quaternion);
  }
  mesh_cap_18.castShadow = options.castShadow ?? true;
  mesh_cap_18.receiveShadow = options.receiveShadow ?? true;
  mesh_cap_18.userData.sculptComponent = {"id": "cap", "name": "Scholar's cap (cylinder body)", "level": "macro", "role": "shell", "importance": 0.9, "confidence": 0.85, "primitive": "cylinder", "topologyClass": "assembled-solid", "topologyRationale": "Scholar's cap (cylinder body) is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "bevel", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.18, "height": 0.12, "depth": 0.18, "units": "relative", "confidence": 0.85}, "transform": {"position": [0, 0.9, 0.0], "rotation": [0, 0, 0], "scale": [0.18, 0.12, 0.18]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "cap", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "cap"}}, "material": "cap", "materialLayers": ["cap"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["cap.frontOrnament"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Red felt/silk cylinder, dark maroon trim band at the base rim."}, "evidenceRefs": ["zones/cap.png"], "details": [], "fidelityTier": "blockout"};
  node_cap_18.add(mesh_cap_18);
  meshes["cap"] = mesh_cap_18;
  colliders["cap"] = {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"};
  destructionGroups["cap"] ??= [];
  destructionGroups["cap"].push(node_cap_18);

  const attachment_cap_brim_19 = null;
  const endpoint_cap_brim_19 = makeAttachmentEndpoint(attachment_cap_brim_19);
  const node_cap_brim_19 = new THREE.Group();
  node_cap_brim_19.name = "Cap trim band__pivot";
  if (endpoint_cap_brim_19) {
    node_cap_brim_19.position.copy(endpoint_cap_brim_19.start);
    node_cap_brim_19.rotation.set(0, 0, 0);
    node_cap_brim_19.scale.set(1, 1, 1);
  } else {
    node_cap_brim_19.position.set(0.0, -0.5, 0.0);
    node_cap_brim_19.rotation.set(0.0, 0.0, 0.0);
    node_cap_brim_19.scale.set(1.05, 0.12, 1.05);
  }
  node_cap_brim_19.userData.sculptComponent = {"id": "cap-brim", "name": "Cap trim band", "level": "meso", "role": "shell", "importance": 0.4, "confidence": 0.75, "primitive": "torus", "topologyClass": "assembled-solid", "topologyRationale": "Cap trim band is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "bevel", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "cap", "attachment": null, "dimensions": {"width": 1.05, "height": 0.12, "depth": 1.05, "units": "relative", "confidence": 0.75}, "transform": {"position": [0, -0.5, 0.0], "rotation": [0, 0, 0], "scale": [1.05, 0.12, 1.05]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "cap-brim", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "capTrim"}}, "material": "capTrim", "materialLayers": ["capTrim"], "deformations": [], "joints": [], "seams": [], "localFeatures": [], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Dark maroon band at the cap's base rim."}, "evidenceRefs": ["zones/cap.png"], "details": [], "fidelityTier": "blockout"};
  node_cap_brim_19.userData.actionProfile = {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "cap-brim", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "capTrim"}};
  (nodes["cap"] ?? root).add(node_cap_brim_19);
  nodes["cap-brim"] = node_cap_brim_19;
  const mesh_cap_brim_19Geometry = endpoint_cap_brim_19
    ? new THREE.CylinderGeometry(endpoint_cap_brim_19.endRadius, endpoint_cap_brim_19.baseRadius, endpoint_cap_brim_19.length, 32, 12)
    : new THREE.TorusGeometry(0.45, 0.08, 24, 96);
  const mesh_cap_brim_19 = new THREE.Mesh(
    mesh_cap_brim_19Geometry,
    materialMap["capTrim"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_cap_brim_19.name = "Cap trim band";
  if (endpoint_cap_brim_19) {
    mesh_cap_brim_19.position.copy(endpoint_cap_brim_19.midpoint);
    mesh_cap_brim_19.quaternion.copy(endpoint_cap_brim_19.quaternion);
  }
  mesh_cap_brim_19.castShadow = options.castShadow ?? true;
  mesh_cap_brim_19.receiveShadow = options.receiveShadow ?? true;
  mesh_cap_brim_19.userData.sculptComponent = {"id": "cap-brim", "name": "Cap trim band", "level": "meso", "role": "shell", "importance": 0.4, "confidence": 0.75, "primitive": "torus", "topologyClass": "assembled-solid", "topologyRationale": "Cap trim band is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "bevel", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "cap", "attachment": null, "dimensions": {"width": 1.05, "height": 0.12, "depth": 1.05, "units": "relative", "confidence": 0.75}, "transform": {"position": [0, -0.5, 0.0], "rotation": [0, 0, 0], "scale": [1.05, 0.12, 1.05]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "cap-brim", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "capTrim"}}, "material": "capTrim", "materialLayers": ["capTrim"], "deformations": [], "joints": [], "seams": [], "localFeatures": [], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Dark maroon band at the cap's base rim."}, "evidenceRefs": ["zones/cap.png"], "details": [], "fidelityTier": "blockout"};
  node_cap_brim_19.add(mesh_cap_brim_19);
  meshes["cap-brim"] = mesh_cap_brim_19;
  colliders["cap-brim"] = {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"};
  destructionGroups["cap-brim"] ??= [];
  destructionGroups["cap-brim"].push(node_cap_brim_19);

  const attachment_cap_ornament_20 = null;
  const endpoint_cap_ornament_20 = makeAttachmentEndpoint(attachment_cap_ornament_20);
  const node_cap_ornament_20 = new THREE.Group();
  node_cap_ornament_20.name = "Cap front ornament/button__pivot";
  if (endpoint_cap_ornament_20) {
    node_cap_ornament_20.position.copy(endpoint_cap_ornament_20.start);
    node_cap_ornament_20.rotation.set(0, 0, 0);
    node_cap_ornament_20.scale.set(1, 1, 1);
  } else {
    node_cap_ornament_20.position.set(0.0, 0.55, 0.85);
    node_cap_ornament_20.rotation.set(0.0, 0.0, 0.0);
    node_cap_ornament_20.scale.set(0.08, 0.08, 0.08);
  }
  node_cap_ornament_20.userData.sculptComponent = {"id": "cap-ornament", "name": "Cap front ornament/button", "level": "micro", "role": "detail", "importance": 0.35, "confidence": 0.7, "primitive": "sphere", "topologyClass": "assembled-solid", "topologyRationale": "Cap front ornament/button is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "cap", "attachment": null, "dimensions": {"width": 0.08, "height": 0.08, "depth": 0.08, "units": "relative", "confidence": 0.7}, "transform": {"position": [0, 0.55, 0.85], "rotation": [0, 0, 0], "scale": [0.08, 0.08, 0.08]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "cap-ornament", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "goldTrim"}}, "material": "goldTrim", "materialLayers": ["goldTrim"], "deformations": [], "joints": [], "seams": [], "localFeatures": [], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Small raised gold button/ornament at the front-top seam."}, "evidenceRefs": ["zones/cap.png"], "details": [], "fidelityTier": "blockout"};
  node_cap_ornament_20.userData.actionProfile = {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "cap-ornament", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "goldTrim"}};
  (nodes["cap"] ?? root).add(node_cap_ornament_20);
  nodes["cap-ornament"] = node_cap_ornament_20;
  const mesh_cap_ornament_20Geometry = endpoint_cap_ornament_20
    ? new THREE.CylinderGeometry(endpoint_cap_ornament_20.endRadius, endpoint_cap_ornament_20.baseRadius, endpoint_cap_ornament_20.length, 32, 12)
    : new THREE.SphereGeometry(0.5, 64, 40);
  const mesh_cap_ornament_20 = new THREE.Mesh(
    mesh_cap_ornament_20Geometry,
    materialMap["goldTrim"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_cap_ornament_20.name = "Cap front ornament/button";
  if (endpoint_cap_ornament_20) {
    mesh_cap_ornament_20.position.copy(endpoint_cap_ornament_20.midpoint);
    mesh_cap_ornament_20.quaternion.copy(endpoint_cap_ornament_20.quaternion);
  }
  mesh_cap_ornament_20.castShadow = options.castShadow ?? true;
  mesh_cap_ornament_20.receiveShadow = options.receiveShadow ?? true;
  mesh_cap_ornament_20.userData.sculptComponent = {"id": "cap-ornament", "name": "Cap front ornament/button", "level": "micro", "role": "detail", "importance": 0.35, "confidence": 0.7, "primitive": "sphere", "topologyClass": "assembled-solid", "topologyRationale": "Cap front ornament/button is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "cap", "attachment": null, "dimensions": {"width": 0.08, "height": 0.08, "depth": 0.08, "units": "relative", "confidence": 0.7}, "transform": {"position": [0, 0.55, 0.85], "rotation": [0, 0, 0], "scale": [0.08, 0.08, 0.08]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "cap-ornament", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "goldTrim"}}, "material": "goldTrim", "materialLayers": ["goldTrim"], "deformations": [], "joints": [], "seams": [], "localFeatures": [], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Small raised gold button/ornament at the front-top seam."}, "evidenceRefs": ["zones/cap.png"], "details": [], "fidelityTier": "blockout"};
  node_cap_ornament_20.add(mesh_cap_ornament_20);
  meshes["cap-ornament"] = mesh_cap_ornament_20;
  colliders["cap-ornament"] = {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"};
  destructionGroups["cap-ornament"] ??= [];
  destructionGroups["cap-ornament"].push(node_cap_ornament_20);

  const attachment_cap_ribbon_l_21 = null;
  const endpoint_cap_ribbon_l_21 = makeAttachmentEndpoint(attachment_cap_ribbon_l_21);
  const node_cap_ribbon_l_21 = new THREE.Group();
  node_cap_ribbon_l_21.name = "Cap ribbon tie (camera-left, occluded/mirrored)__pivot";
  if (endpoint_cap_ribbon_l_21) {
    node_cap_ribbon_l_21.position.copy(endpoint_cap_ribbon_l_21.start);
    node_cap_ribbon_l_21.rotation.set(0, 0, 0);
    node_cap_ribbon_l_21.scale.set(1, 1, 1);
  } else {
    node_cap_ribbon_l_21.position.set(-0.7, -0.3, -0.4);
    node_cap_ribbon_l_21.rotation.set(0.0, 0.0, 0.0);
    node_cap_ribbon_l_21.scale.set(0.06, 0.55, 0.01);
  }
  node_cap_ribbon_l_21.userData.sculptComponent = {"id": "cap-ribbon-l", "name": "Cap ribbon tie (camera-left, occluded/mirrored)", "level": "meso", "role": "appendage", "importance": 0.25, "confidence": 0.35, "primitive": "plane-card", "topologyClass": "assembled-solid", "topologyRationale": "Cap ribbon tie (camera-left, occluded/mirrored) is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "cap", "attachment": null, "dimensions": {"width": 0.06, "height": 0.55, "depth": 0.01, "units": "relative", "confidence": 0.35}, "transform": {"position": [-0.7, -0.3, -0.4], "rotation": [0, 0, 0], "scale": [0.06, 0.55, 0.01]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "cap-ribbon-l", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "capTrim"}}, "material": "capTrim", "materialLayers": ["capTrim"], "deformations": [], "joints": [], "seams": [], "localFeatures": [], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Mirrored from the visible ribbon; occluded by hair/beard in the source photo, low confidence."}, "evidenceRefs": ["full-object"], "details": [], "fidelityTier": "blockout"};
  node_cap_ribbon_l_21.userData.actionProfile = {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "cap-ribbon-l", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "capTrim"}};
  (nodes["cap"] ?? root).add(node_cap_ribbon_l_21);
  nodes["cap-ribbon-l"] = node_cap_ribbon_l_21;
  const mesh_cap_ribbon_l_21Geometry = endpoint_cap_ribbon_l_21
    ? new THREE.CylinderGeometry(endpoint_cap_ribbon_l_21.endRadius, endpoint_cap_ribbon_l_21.baseRadius, endpoint_cap_ribbon_l_21.length, 32, 12)
    : new THREE.PlaneGeometry(1, 1, 24, 24);
  const mesh_cap_ribbon_l_21 = new THREE.Mesh(
    mesh_cap_ribbon_l_21Geometry,
    materialMap["capTrim"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_cap_ribbon_l_21.name = "Cap ribbon tie (camera-left, occluded/mirrored)";
  if (endpoint_cap_ribbon_l_21) {
    mesh_cap_ribbon_l_21.position.copy(endpoint_cap_ribbon_l_21.midpoint);
    mesh_cap_ribbon_l_21.quaternion.copy(endpoint_cap_ribbon_l_21.quaternion);
  }
  mesh_cap_ribbon_l_21.castShadow = options.castShadow ?? true;
  mesh_cap_ribbon_l_21.receiveShadow = options.receiveShadow ?? true;
  mesh_cap_ribbon_l_21.userData.sculptComponent = {"id": "cap-ribbon-l", "name": "Cap ribbon tie (camera-left, occluded/mirrored)", "level": "meso", "role": "appendage", "importance": 0.25, "confidence": 0.35, "primitive": "plane-card", "topologyClass": "assembled-solid", "topologyRationale": "Cap ribbon tie (camera-left, occluded/mirrored) is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "cap", "attachment": null, "dimensions": {"width": 0.06, "height": 0.55, "depth": 0.01, "units": "relative", "confidence": 0.35}, "transform": {"position": [-0.7, -0.3, -0.4], "rotation": [0, 0, 0], "scale": [0.06, 0.55, 0.01]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "cap-ribbon-l", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "capTrim"}}, "material": "capTrim", "materialLayers": ["capTrim"], "deformations": [], "joints": [], "seams": [], "localFeatures": [], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Mirrored from the visible ribbon; occluded by hair/beard in the source photo, low confidence."}, "evidenceRefs": ["full-object"], "details": [], "fidelityTier": "blockout"};
  node_cap_ribbon_l_21.add(mesh_cap_ribbon_l_21);
  meshes["cap-ribbon-l"] = mesh_cap_ribbon_l_21;
  colliders["cap-ribbon-l"] = {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"};
  destructionGroups["cap-ribbon-l"] ??= [];
  destructionGroups["cap-ribbon-l"].push(node_cap_ribbon_l_21);

  const attachment_cap_ribbon_r_22 = null;
  const endpoint_cap_ribbon_r_22 = makeAttachmentEndpoint(attachment_cap_ribbon_r_22);
  const node_cap_ribbon_r_22 = new THREE.Group();
  node_cap_ribbon_r_22.name = "Cap ribbon tie (camera-right, visible)__pivot";
  if (endpoint_cap_ribbon_r_22) {
    node_cap_ribbon_r_22.position.copy(endpoint_cap_ribbon_r_22.start);
    node_cap_ribbon_r_22.rotation.set(0, 0, 0);
    node_cap_ribbon_r_22.scale.set(1, 1, 1);
  } else {
    node_cap_ribbon_r_22.position.set(0.7, -0.3, -0.4);
    node_cap_ribbon_r_22.rotation.set(0.0, 0.0, 0.0);
    node_cap_ribbon_r_22.scale.set(0.06, 0.55, 0.01);
  }
  node_cap_ribbon_r_22.userData.sculptComponent = {"id": "cap-ribbon-r", "name": "Cap ribbon tie (camera-right, visible)", "level": "meso", "role": "appendage", "importance": 0.3, "confidence": 0.5, "primitive": "plane-card", "topologyClass": "assembled-solid", "topologyRationale": "Cap ribbon tie (camera-right, visible) is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "cap", "attachment": null, "dimensions": {"width": 0.06, "height": 0.55, "depth": 0.01, "units": "relative", "confidence": 0.5}, "transform": {"position": [0.7, -0.3, -0.4], "rotation": [0, 0, 0], "scale": [0.06, 0.55, 0.01]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "cap-ribbon-r", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "capTrim"}}, "material": "capTrim", "materialLayers": ["capTrim"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["cap.ribbonTies"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Narrow ribbon hanging past ear height, slight outward flare at the tip."}, "evidenceRefs": ["zones/face.png"], "details": [], "fidelityTier": "blockout"};
  node_cap_ribbon_r_22.userData.actionProfile = {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "cap-ribbon-r", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "capTrim"}};
  (nodes["cap"] ?? root).add(node_cap_ribbon_r_22);
  nodes["cap-ribbon-r"] = node_cap_ribbon_r_22;
  const mesh_cap_ribbon_r_22Geometry = endpoint_cap_ribbon_r_22
    ? new THREE.CylinderGeometry(endpoint_cap_ribbon_r_22.endRadius, endpoint_cap_ribbon_r_22.baseRadius, endpoint_cap_ribbon_r_22.length, 32, 12)
    : new THREE.PlaneGeometry(1, 1, 24, 24);
  const mesh_cap_ribbon_r_22 = new THREE.Mesh(
    mesh_cap_ribbon_r_22Geometry,
    materialMap["capTrim"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_cap_ribbon_r_22.name = "Cap ribbon tie (camera-right, visible)";
  if (endpoint_cap_ribbon_r_22) {
    mesh_cap_ribbon_r_22.position.copy(endpoint_cap_ribbon_r_22.midpoint);
    mesh_cap_ribbon_r_22.quaternion.copy(endpoint_cap_ribbon_r_22.quaternion);
  }
  mesh_cap_ribbon_r_22.castShadow = options.castShadow ?? true;
  mesh_cap_ribbon_r_22.receiveShadow = options.receiveShadow ?? true;
  mesh_cap_ribbon_r_22.userData.sculptComponent = {"id": "cap-ribbon-r", "name": "Cap ribbon tie (camera-right, visible)", "level": "meso", "role": "appendage", "importance": 0.3, "confidence": 0.5, "primitive": "plane-card", "topologyClass": "assembled-solid", "topologyRationale": "Cap ribbon tie (camera-right, visible) is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "cap", "attachment": null, "dimensions": {"width": 0.06, "height": 0.55, "depth": 0.01, "units": "relative", "confidence": 0.5}, "transform": {"position": [0.7, -0.3, -0.4], "rotation": [0, 0, 0], "scale": [0.06, 0.55, 0.01]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "cap-ribbon-r", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "capTrim"}}, "material": "capTrim", "materialLayers": ["capTrim"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["cap.ribbonTies"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Narrow ribbon hanging past ear height, slight outward flare at the tip."}, "evidenceRefs": ["zones/face.png"], "details": [], "fidelityTier": "blockout"};
  node_cap_ribbon_r_22.add(mesh_cap_ribbon_r_22);
  meshes["cap-ribbon-r"] = mesh_cap_ribbon_r_22;
  colliders["cap-ribbon-r"] = {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"};
  destructionGroups["cap-ribbon-r"] ??= [];
  destructionGroups["cap-ribbon-r"].push(node_cap_ribbon_r_22);

  const attachment_hand_l_23 = null;
  const endpoint_hand_l_23 = makeAttachmentEndpoint(attachment_hand_l_23);
  const node_hand_l_23 = new THREE.Group();
  node_hand_l_23.name = "Hand (camera-left, folded)__pivot";
  if (endpoint_hand_l_23) {
    node_hand_l_23.position.copy(endpoint_hand_l_23.start);
    node_hand_l_23.rotation.set(0, 0, 0);
    node_hand_l_23.scale.set(1, 1, 1);
  } else {
    node_hand_l_23.position.set(-0.09, -0.28, 0.3);
    node_hand_l_23.rotation.set(0.0, 0.0, 0.0);
    node_hand_l_23.scale.set(0.13, 0.09, 0.1);
  }
  node_hand_l_23.userData.sculptComponent = {"id": "hand-l", "name": "Hand (camera-left, folded)", "level": "meso", "role": "body", "importance": 0.5, "confidence": 0.6, "primitive": "capsule", "topologyClass": "assembled-solid", "topologyRationale": "Hand (camera-left, folded) is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.13, "height": 0.09, "depth": 0.1, "units": "relative", "confidence": 0.6}, "transform": {"position": [-0.09, -0.28, 0.3], "rotation": [0, 0, 0], "scale": [0.13, 0.09, 0.1]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "hand-l", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "skin"}}, "material": "skin", "materialLayers": ["skin"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["hands.foldedPose"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Simplified stylized volume, no per-knuckle detail (below resolvable scale in reference)."}, "evidenceRefs": ["zones/hands.png"], "details": [], "fidelityTier": "blockout"};
  node_hand_l_23.userData.actionProfile = {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "hand-l", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "skin"}};
  (nodes["root"] ?? root).add(node_hand_l_23);
  nodes["hand-l"] = node_hand_l_23;
  const mesh_hand_l_23Geometry = endpoint_hand_l_23
    ? new THREE.CylinderGeometry(endpoint_hand_l_23.endRadius, endpoint_hand_l_23.baseRadius, endpoint_hand_l_23.length, 32, 12)
    : new THREE.CapsuleGeometry(0.35, 0.7, 16, 32);
  const mesh_hand_l_23 = new THREE.Mesh(
    mesh_hand_l_23Geometry,
    materialMap["skin"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_hand_l_23.name = "Hand (camera-left, folded)";
  if (endpoint_hand_l_23) {
    mesh_hand_l_23.position.copy(endpoint_hand_l_23.midpoint);
    mesh_hand_l_23.quaternion.copy(endpoint_hand_l_23.quaternion);
  }
  mesh_hand_l_23.castShadow = options.castShadow ?? true;
  mesh_hand_l_23.receiveShadow = options.receiveShadow ?? true;
  mesh_hand_l_23.userData.sculptComponent = {"id": "hand-l", "name": "Hand (camera-left, folded)", "level": "meso", "role": "body", "importance": 0.5, "confidence": 0.6, "primitive": "capsule", "topologyClass": "assembled-solid", "topologyRationale": "Hand (camera-left, folded) is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.13, "height": 0.09, "depth": 0.1, "units": "relative", "confidence": 0.6}, "transform": {"position": [-0.09, -0.28, 0.3], "rotation": [0, 0, 0], "scale": [0.13, 0.09, 0.1]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "hand-l", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "skin"}}, "material": "skin", "materialLayers": ["skin"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["hands.foldedPose"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Simplified stylized volume, no per-knuckle detail (below resolvable scale in reference)."}, "evidenceRefs": ["zones/hands.png"], "details": [], "fidelityTier": "blockout"};
  node_hand_l_23.add(mesh_hand_l_23);
  meshes["hand-l"] = mesh_hand_l_23;
  colliders["hand-l"] = {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"};
  destructionGroups["hand-l"] ??= [];
  destructionGroups["hand-l"].push(node_hand_l_23);

  const attachment_hand_r_24 = null;
  const endpoint_hand_r_24 = makeAttachmentEndpoint(attachment_hand_r_24);
  const node_hand_r_24 = new THREE.Group();
  node_hand_r_24.name = "Hand (camera-right, folded over)__pivot";
  if (endpoint_hand_r_24) {
    node_hand_r_24.position.copy(endpoint_hand_r_24.start);
    node_hand_r_24.rotation.set(0, 0, 0);
    node_hand_r_24.scale.set(1, 1, 1);
  } else {
    node_hand_r_24.position.set(0.09, -0.3, 0.32);
    node_hand_r_24.rotation.set(0.0, 0.0, 0.0);
    node_hand_r_24.scale.set(0.13, 0.09, 0.1);
  }
  node_hand_r_24.userData.sculptComponent = {"id": "hand-r", "name": "Hand (camera-right, folded over)", "level": "meso", "role": "body", "importance": 0.5, "confidence": 0.6, "primitive": "capsule", "topologyClass": "assembled-solid", "topologyRationale": "Hand (camera-right, folded over) is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.13, "height": 0.09, "depth": 0.1, "units": "relative", "confidence": 0.6}, "transform": {"position": [0.09, -0.3, 0.32], "rotation": [0, 0, 0], "scale": [0.13, 0.09, 0.1]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "hand-r", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "skin"}}, "material": "skin", "materialLayers": ["skin"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["hands.foldedPose"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Overlaps hand-l per reference's interlaced/overlapping fingers."}, "evidenceRefs": ["zones/hands.png"], "details": [], "fidelityTier": "blockout"};
  node_hand_r_24.userData.actionProfile = {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "hand-r", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "skin"}};
  (nodes["root"] ?? root).add(node_hand_r_24);
  nodes["hand-r"] = node_hand_r_24;
  const mesh_hand_r_24Geometry = endpoint_hand_r_24
    ? new THREE.CylinderGeometry(endpoint_hand_r_24.endRadius, endpoint_hand_r_24.baseRadius, endpoint_hand_r_24.length, 32, 12)
    : new THREE.CapsuleGeometry(0.35, 0.7, 16, 32);
  const mesh_hand_r_24 = new THREE.Mesh(
    mesh_hand_r_24Geometry,
    materialMap["skin"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_hand_r_24.name = "Hand (camera-right, folded over)";
  if (endpoint_hand_r_24) {
    mesh_hand_r_24.position.copy(endpoint_hand_r_24.midpoint);
    mesh_hand_r_24.quaternion.copy(endpoint_hand_r_24.quaternion);
  }
  mesh_hand_r_24.castShadow = options.castShadow ?? true;
  mesh_hand_r_24.receiveShadow = options.receiveShadow ?? true;
  mesh_hand_r_24.userData.sculptComponent = {"id": "hand-r", "name": "Hand (camera-right, folded over)", "level": "meso", "role": "body", "importance": 0.5, "confidence": 0.6, "primitive": "capsule", "topologyClass": "assembled-solid", "topologyRationale": "Hand (camera-right, folded over) is a discrete assembled part matched to observed silhouette, not a continuous organic sculpt.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.01, "segments": 2}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": null, "dimensions": {"width": 0.13, "height": 0.09, "depth": 0.1, "units": "relative", "confidence": 0.6}, "transform": {"position": [0.09, -0.3, 0.32], "rotation": [0, 0, 0], "scale": [0.13, 0.09, 0.1]}, "actionProfile": {"animationRole": "static", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "hand-r", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "skin"}}, "material": "skin", "materialLayers": ["skin"], "deformations": [], "joints": [], "seams": [], "localFeatures": ["hands.foldedPose"], "surfaceDetail": {"macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0, "normalPattern": "", "displacementPattern": "", "occlusionPattern": "", "edgeWearPattern": "", "notes": "Overlaps hand-l per reference's interlaced/overlapping fingers."}, "evidenceRefs": ["zones/hands.png"], "details": [], "fidelityTier": "blockout"};
  node_hand_r_24.add(mesh_hand_r_24);
  meshes["hand-r"] = mesh_hand_r_24;
  colliders["hand-r"] = {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "box proxy"};
  destructionGroups["hand-r"] ??= [];
  destructionGroups["hand-r"].push(node_hand_r_24);

  root.userData.sculptRuntime = { nodes, meshes, sockets, colliders, destructionGroups } satisfies ProceduralModelRuntime;
  root.userData.lookDevTargets = {"qualityPriority": "reference-fidelity", "materialPass": {"albedoPaletteRequired": true, "roughnessVariationRequired": true, "normalOrBumpRequired": true, "localOverridesRequired": true, "minimumTextureResolution": 1024, "preferredTextureResolution": 2048, "independentMapChannels": ["albedo", "roughness", "height", "normal", "ambient-occlusion"], "requiredSurfaceFrequencyBands": ["macro", "meso", "micro"], "geometryReliefRequiredWhenSilhouetteAffected": true, "referencePbrExtraction": {"requiredWhenSourceImagePresent": true, "targetThreshold": 0.7, "stopOnLowConfidence": true, "script": "forge/stage1_intake/extract_pbr_evidence.py", "acceptedLimitation": "single-image extraction is reference-derived inference, not exact photogrammetry"}, "mustAvoid": ["single flat albedo per material", "uniform roughness", "albedo texture reused as roughness/height/normal/AO", "single-frequency random noise", "plastic-looking smooth bark, stone, cloth, foliage, or aged material", "local color/detail described only in prose without material masks", "claiming exact PBR recovery when confidence is below the target threshold"]}, "lightingPass": {"requiredTerms": ["key light", "fill light", "rim or environment light", "exposure", "tone mapping", "background", "contact shadow"], "mustAvoid": ["ambient-only lighting", "flat value range", "missing contact shadow", "reference lighting copied without separating material readability"]}, "screenshotReview": ["Compare albedo palette and local color zones.", "Compare roughness/normal/bump response under light.", "Compare cavity dirt, edge wear, stains, moss, scratches, or other local masks.", "Compare key/fill/rim structure, exposure, tone mapping, background, and contact shadows.", "Capture a neutral-light render to verify material readability without reference lighting.", "Capture a grazing-light close-up to expose flat normals, uniform roughness, tiling, and plastic highlights.", "Capture a reference-matched render from the same camera framing as the source."]};
  root.userData.actionReadiness = {
    note: 'Use root.userData.sculptRuntime.nodes for transforms, sockets for attachments, colliders for physics proxies, and destructionGroups for breakable sets.',
  };
  return root;
}

export function createConfuciusSeatedBustLookDevLights(
  mode: 'neutral' | 'grazing' | 'reference' = 'neutral',
): THREE.Group {
  const lights = new THREE.Group();
  lights.name = "Confucius seated bust look-dev lights";
  const hemi = new THREE.HemisphereLight(
    mode === 'reference' ? 0xfff0d6 : 0xf2f4ff,
    0x363b42,
    mode === 'grazing' ? 0.28 : mode === 'reference' ? 0.72 : 0.85,
  );
  lights.add(hemi);
  const key = new THREE.DirectionalLight(
    mode === 'reference' ? 0xffcf8a : 0xfff4e8,
    mode === 'grazing' ? 4.2 : mode === 'reference' ? 2.6 : 2.15,
  );
  if (mode === 'grazing') key.position.set(7.5, 1.1, 4.0);
  else if (mode === 'reference') key.position.set(-4.5, 7.5, 5.0);
  else key.position.set(-4.0, 6.0, 5.5);
  key.castShadow = true;
  key.shadow.mapSize.set(4096, 4096);
  key.shadow.bias = -0.00025;
  key.shadow.normalBias = 0.018;
  key.shadow.radius = 7;
  key.shadow.blurSamples = 24;
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 30;
  key.shadow.camera.left = -2.6;
  key.shadow.camera.right = 2.6;
  key.shadow.camera.top = 2.6;
  key.shadow.camera.bottom = -2.6;
  key.shadow.camera.updateProjectionMatrix();
  lights.add(key);
  const fill = new THREE.DirectionalLight(0xa8c4ff, mode === 'grazing' ? 0.12 : 0.42);
  fill.position.set(4.0, 3.0, 3.5);
  lights.add(fill);
  const rim = new THREE.DirectionalLight(0xfff1c4, mode === 'grazing' ? 0.28 : 0.85);
  rim.position.set(0.5, 4.5, -6.0);
  lights.add(rim);
  lights.userData.reviewMode = mode;
  lights.userData.lightingFromPhoto = [];
  lights.userData.lookDevTargets = {"qualityPriority": "reference-fidelity", "materialPass": {"albedoPaletteRequired": true, "roughnessVariationRequired": true, "normalOrBumpRequired": true, "localOverridesRequired": true, "minimumTextureResolution": 1024, "preferredTextureResolution": 2048, "independentMapChannels": ["albedo", "roughness", "height", "normal", "ambient-occlusion"], "requiredSurfaceFrequencyBands": ["macro", "meso", "micro"], "geometryReliefRequiredWhenSilhouetteAffected": true, "referencePbrExtraction": {"requiredWhenSourceImagePresent": true, "targetThreshold": 0.7, "stopOnLowConfidence": true, "script": "forge/stage1_intake/extract_pbr_evidence.py", "acceptedLimitation": "single-image extraction is reference-derived inference, not exact photogrammetry"}, "mustAvoid": ["single flat albedo per material", "uniform roughness", "albedo texture reused as roughness/height/normal/AO", "single-frequency random noise", "plastic-looking smooth bark, stone, cloth, foliage, or aged material", "local color/detail described only in prose without material masks", "claiming exact PBR recovery when confidence is below the target threshold"]}, "lightingPass": {"requiredTerms": ["key light", "fill light", "rim or environment light", "exposure", "tone mapping", "background", "contact shadow"], "mustAvoid": ["ambient-only lighting", "flat value range", "missing contact shadow", "reference lighting copied without separating material readability"]}, "screenshotReview": ["Compare albedo palette and local color zones.", "Compare roughness/normal/bump response under light.", "Compare cavity dirt, edge wear, stains, moss, scratches, or other local masks.", "Compare key/fill/rim structure, exposure, tone mapping, background, and contact shadows.", "Capture a neutral-light render to verify material readability without reference lighting.", "Capture a grazing-light close-up to expose flat normals, uniform roughness, tiling, and plastic highlights.", "Capture a reference-matched render from the same camera framing as the source."]};
  return lights;
}

// PBR materials (clearcoat/iridescence/transmission/anisotropy) need an environment
// map to visually behave as intended — call this once per renderer and assign the
// result to scene.environment before rendering. No external HDR asset required.
export function createConfuciusSeatedBustEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const texture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  return texture;
}

// Plan 1.3 §3.2 — auto-framing by bounding box. The Divine Eye can only compare a
// render to the reference if the object is FRAMED consistently (an object framed
// differently scores as wrong even when its shape is right). This positions the camera
// deterministically from the object's bounding box so it fills the frame at a stable
// margin, and sets near/far to the object scale. Call after adding the model to the
// scene, and again on resize (after updating camera.aspect).
export function frameConfuciusSeatedBustCamera(
  camera: THREE.PerspectiveCamera,
  object: THREE.Object3D,
  options: { margin?: number; azimuthDeg?: number; elevationDeg?: number } = {},
): void {
  const box = new THREE.Box3().setFromObject(object);
  if (box.isEmpty()) return;
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const margin = options.margin ?? 1.15;
  const maxDim = Math.max(size.x, size.y, size.z) * margin;
  const fov = (camera.fov * Math.PI) / 180;
  // distance so the largest object dimension fits vertically in the frame
  const distance = (maxDim / 2) / Math.tan(fov / 2);
  const az = ((options.azimuthDeg ?? 0) * Math.PI) / 180;
  const el = ((options.elevationDeg ?? 0) * Math.PI) / 180;
  const dir = new THREE.Vector3(
    Math.sin(az) * Math.cos(el),
    Math.sin(el),
    Math.cos(az) * Math.cos(el),
  );
  camera.position.copy(center).addScaledVector(dir, distance);
  camera.near = Math.max(0.01, distance - maxDim);
  camera.far = distance + maxDim * 2;
  camera.lookAt(center);
  camera.updateProjectionMatrix();
}

// Plan 1.3 §3.2c — PRESENTATION composer (DOF + bloom). CRITICAL (R-POSTFX): this is
// for the showcase/hero render ONLY. The Divine Eye's EVALUATION render MUST use a
// plain renderer with NO composer — bloom blows highlights and DOF blurs edges, which
// would corrupt the deterministic IoU/DCD/edge/blowout signals. Enable dof/bloom ONLY
// when the reference photo actually exhibits them (detect_reference_effects.py authorizes).
export function createConfuciusSeatedBustPresentationComposer(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  options: { dof?: boolean; bloom?: boolean; bloomStrength?: number; dofFocus?: number; dofAperture?: number } = {},
): EffectComposer {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  if (options.dof) {
    composer.addPass(new BokehPass(scene, camera, {
      focus: options.dofFocus ?? 10.0,
      aperture: options.dofAperture ?? 0.0002,
      maxblur: 0.01,
    }));
  }
  if (options.bloom) {
    const size = new THREE.Vector2();
    renderer.getSize(size);
    composer.addPass(new UnrealBloomPass(size, options.bloomStrength ?? 0.4, 0.4, 0.85));
  }
  return composer;
}

export function configureConfuciusSeatedBustRenderer(renderer: THREE.WebGLRenderer): void {
  // Load-bearing for view-dependent finishes (anodized / Doppler): without ACES + sRGB
  // the environment reflection reads flat/washed instead of a believable metal response.
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
}

export function createConfuciusSeatedBustInspectControls(
  camera: THREE.Camera,
  domElement: HTMLElement,
): OrbitControls {
  // View-dependent finishes only read correctly once the user orbits — their color
  // comes from the environment reflection, not albedo, so free rotation matters here.
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;
  controls.minDistance = 1.0;
  controls.maxDistance = 8.0;
  controls.autoRotate = false;
  return controls;
}
