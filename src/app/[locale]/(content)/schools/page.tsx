import Link from 'next/link';
import type { Metadata } from 'next';
import { dict } from '@/data/dictionary';
import { schools } from '@/data/schools';
import { isLocale, t, type Locale } from '@/lib/i18n';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale: Locale = isLocale(params.locale) ? params.locale : 'en';
  return { title: t(dict.schools, locale) };
}

export default function SchoolsIndex({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  return (
    <main>
      <h1 className="page-title serif">{t(dict.schools, locale)}</h1>
      <div className="card-grid">
        {schools.map((s) => (
          <Link
            key={s.slug}
            href={`/${locale}/schools/${s.slug}`}
            className="index-card"
            style={{ ['--accent-base' as string]: s.accent }}
          >
            <span className="index-card__emblem" aria-hidden="true">{s.emblem}</span>
            <span className="index-card__name serif">{t(s.name, locale)}</span>
            <span className="index-card__meta mono">{t(s.period, locale)}</span>
            <span className="index-card__tagline">{t(s.tagline, locale)}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
