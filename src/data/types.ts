import type { Localized } from '@/lib/i18n';

/** Geographic-cultural origin of a school, used to cluster the knowledge graph. */
export type Region = 'china' | 'india' | 'japan';

/** How one school relates to another — the semantics of a graph edge. */
export type RelationType = 'influence' | 'opposition' | 'synthesis' | 'lineage';

/** A directed relation from one school to another (a graph edge). */
export interface SchoolRelation {
  /** Slug of the target school. */
  to: string;
  type: RelationType;
  /** Optional short note explaining the connection. */
  note?: Localized;
}

/** A school / current of Eastern philosophical thought (e.g. Taoism). */
export interface School {
  slug: string;
  name: Localized;
  period: Localized;
  /** Geographic-cultural origin; clusters the graph layout. */
  region: Region;
  /** Single ideograph / glyph used as the node emblem (e.g. 道, 儒, 法). */
  emblem: string;
  /** Short tagline shown on cards. */
  tagline: Localized;
  /** Longer description shown on the school page. */
  description: Localized;
  /** Core ideas of the school. */
  coreIdeas: Localized<string[]>;
  /** Slugs of philosophers associated with this school. */
  philosopherSlugs: string[];
  /** Relations to other schools — the edges of the knowledge graph. */
  relations: SchoolRelation[];
  /** Accent color used by the graph node / cards. */
  accent: string;
  /** Key works / bibliography for this school. */
  keyWorks?: KeyWork[];
}

/** A key work / bibliographic reference. */
export interface KeyWork {
  title: Localized;
  author: Localized;
  year: string;
  note?: Localized;
}

/** A single notable quote with attribution context. */
export interface Quote {
  text: Localized;
  source?: Localized;
}

export interface Philosopher {
  slug: string;
  name: Localized;
  /** Years of birth/death, already formatted (e.g. "551–479 BC"). */
  years: Localized;
  birthplace: Localized;
  schoolSlugs: string[];
  /** Epithet shown under the name (e.g. "The First Teacher"). */
  epithet: Localized;
  /** Short biography, one paragraph per array entry. */
  biography: Localized<string[]>;
  /** Main contributions to philosophy. */
  contributions: Localized<string[]>;
  quotes: Quote[];
  /** Personality / intellectual traits. */
  traits: Localized<string[]>;
  /** Striking facts about their life. */
  facts: Localized<string[]>;
  /** Optional pre-rendered figure image (public path); placeholder until DALL-E art. */
  figureImage?: string;
}

/** One multiple-choice quiz question. */
export interface QuizQuestion {
  id: string;
  philosopherSlug: string;
  prompt: Localized;
  /** Exactly four options; the first one is the correct answer (shuffled at runtime). */
  options: Localized<string[]>;
  /** Shown after answering. */
  explanation: Localized;
}
