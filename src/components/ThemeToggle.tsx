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
  return (
    <button
      className="iconbtn"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={dark ? t(dict.switchToLight, locale) : t(dict.switchToDark, locale)}
    >
      <Icon name={dark ? 'sun' : 'moon'} />
    </button>
  );
}
