import Link from 'next/link';
import type { Metadata } from 'next';
import { dict } from '@/data/dictionary';
import { philosophers } from '@/data/philosophers';
import { isLocale, t, type Locale } from '@/lib/i18n';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale: Locale = isLocale(params.locale) ? params.locale : 'en';
  return { title: t(dict.philosophers, locale) };
}

export default function PhilosophersIndex({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  return (
    <main>
      <h1 className="page-title serif">{t(dict.philosophers, locale)}</h1>
      <div className="card-grid">
        {philosophers.map((p) => (
          <Link key={p.slug} href={`/${locale}/philosophers/${p.slug}`} className="index-card">
            <span className="index-card__name serif">{t(p.name, locale)}</span>
            <span className="index-card__meta mono">{t(p.years, locale)}</span>
            <span className="index-card__tagline">{t(p.epithet, locale)}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
