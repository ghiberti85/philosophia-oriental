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

  function handleToggle(e: React.MouseEvent<HTMLButtonElement>) {
    const next = dark ? 'light' : 'dark';

    // Radial ripple expanding from click point via View Transitions API.
    // Falls back to instant switch when the API is unavailable or user
    // prefers reduced motion.
    const vt = (document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    }).startViewTransition;

    const prefersReduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!vt || prefersReduced) {
      setTheme(next);
      return;
    }

    // On mobile, touch-generated click events can have clientX/Y = 0.
    // Fall back to the button's visual centre so the ripple always starts
    // from the correct position regardless of input device.
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || rect.left + rect.width / 2;
    const y = e.clientY || rect.top + rect.height / 2;
    document.documentElement.style.setProperty('--vt-x', `${x}px`);
    document.documentElement.style.setProperty('--vt-y', `${y}px`);

    vt.call(document, () => setTheme(next));
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
