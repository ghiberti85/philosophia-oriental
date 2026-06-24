'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { dict } from '@/data/dictionary';
import { t, type Locale } from '@/lib/i18n';
import { Icon } from './dashboard/ui';

export function ThemeToggle({ locale }: { locale: Locale }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === 'dark';

  // Resolve a theme's base background colour by reading the --bg token from a
  // throwaway probe carrying (or not) the `.dark` class — so the fallback
  // ripple always matches the design tokens instead of hard-coded hexes.
  function bgFor(theme: 'light' | 'dark'): string {
    const probe = document.createElement('div');
    if (theme === 'dark') probe.className = 'dark';
    probe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none';
    document.body.appendChild(probe);
    const bg = getComputedStyle(probe).getPropertyValue('--bg').trim();
    probe.remove();
    return bg || (theme === 'dark' ? '#0f1117' : '#fbf8f1');
  }

  // Manual radial reveal for browsers without the View Transitions API
  // (notably iOS Safari < 18). An overlay painted in the *target* theme's
  // background expands as a clip-path circle from the tap point; once it
  // covers the viewport we swap the theme underneath and drop the overlay,
  // so the colours line up seamlessly.
  function runFallbackRipple(x: number, y: number, next: 'light' | 'dark') {
    const overlay = document.createElement('div');
    overlay.style.cssText = `position:fixed;inset:0;z-index:9999;pointer-events:none;background:${bgFor(
      next,
    )};clip-path:circle(0px at ${x}px ${y}px)`;
    document.body.appendChild(overlay);

    const maxR = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const finish = () => {
      setTheme(next);
      requestAnimationFrame(() => overlay.remove());
    };

    if (typeof overlay.animate === 'function') {
      const anim = overlay.animate(
        [
          { clipPath: `circle(0px at ${x}px ${y}px)` },
          { clipPath: `circle(${maxR}px at ${x}px ${y}px)` },
        ],
        { duration: 600, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
      );
      anim.addEventListener('finish', finish);
    } else {
      finish();
    }
  }

  function handleToggle(e: React.MouseEvent<HTMLButtonElement>) {
    const next: 'light' | 'dark' = dark ? 'light' : 'dark';

    const prefersReduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setTheme(next);
      return;
    }

    // On mobile, touch-generated click events can have clientX/Y = 0.
    // Fall back to the button's visual centre so the ripple always starts
    // from the correct position regardless of input device.
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || rect.left + rect.width / 2;
    const y = e.clientY || rect.top + rect.height / 2;

    // Preferred path: native View Transitions API (desktop, Safari 18+).
    const vt = (document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    }).startViewTransition;

    if (vt) {
      document.documentElement.style.setProperty('--vt-x', `${x}px`);
      document.documentElement.style.setProperty('--vt-y', `${y}px`);
      vt.call(document, () => setTheme(next));
      return;
    }

    // Fallback ripple for browsers without the API (e.g. iOS Safari < 18).
    runFallbackRipple(x, y, next);
  }

  return (
    <button
      className="iconbtn"
      onClick={handleToggle}
      aria-label={dark ? t(dict.switchToLight, locale) : t(dict.switchToDark, locale)}
    >
      <Icon name={dark ? 'sun' : 'moon'} />
    </button>
  );
}
