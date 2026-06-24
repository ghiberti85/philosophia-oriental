'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { dict } from '@/data/dictionary';
import { quoteOfTheDay } from '@/lib/quote-of-the-day';
import { t, type Locale } from '@/lib/i18n';
import { ThemeToggle } from './ThemeToggle';

export function Topbar({ locale }: { locale: Locale }) {
  const qod = useMemo(() => {
    const { quote, philosopher } = quoteOfTheDay();
    return { text: t(quote.text, locale), who: t(philosopher.name, locale) };
  }, [locale]);

  return (
    <header className="topbar">
      <div className="wordmark">
        <span className="wordmark__glyph brush" aria-hidden="true">東</span>
        <span className="wordmark__name serif">Philosophia Oriental</span>
        <span className="wordmark__sub mono">{t(dict.tagline, locale)}</span>
      </div>

      <div className="ticker" title={`${qod.text} — ${qod.who}`}>
        <span className="ticker__label mono">{t(dict.quoteOfTheDay, locale)}</span>
        <span className="ticker__text">
          “{qod.text}” <span className="mono ticker__who">— {qod.who}</span>
        </span>
      </div>

      <div className="topbar__actions">
        <div className="seg" role="group" aria-label={t(dict.language, locale)}>
          <Link href="/en" aria-current={locale === 'en'} prefetch={false}>EN</Link>
          <Link href="/pt" aria-current={locale === 'pt'} prefetch={false}>PT</Link>
        </div>
        <ThemeToggle locale={locale} />
      </div>
    </header>
  );
}
