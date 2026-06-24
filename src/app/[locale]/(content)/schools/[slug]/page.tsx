import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { dict } from '@/data/dictionary';
import { getPhilosopher } from '@/data/philosophers';
import { schools, getSchool } from '@/data/schools';
import type { Philosopher } from '@/data/types';
import { isLocale, LOCALES, t, type Locale } from '@/lib/i18n';

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => schools.map((s) => ({ locale, slug: s.slug })));
}

export function generateMetadata({ params }: { params: { locale: string; slug: string } }): Metadata {
  const locale: Locale = isLocale(params.locale) ? params.locale : 'en';
  const school = getSchool(params.slug);
  return { title: school ? t(school.name, locale) : t(dict.schools, locale) };
}

export default function SchoolPage({ params }: { params: { locale: Locale; slug: string } }) {
  const { locale, slug } = params;
  const school = getSchool(slug);
  if (!school) notFound();
  const sages = school.philosopherSlugs
    .map(getPhilosopher)
    .filter((p): p is Philosopher => Boolean(p));

  return (
    <main className="detail">
      <header className="detail__head" style={{ ['--accent-base' as string]: school.accent }}>
        <span className="detail__emblem" aria-hidden="true">{school.emblem}</span>
        <div>
          <h1 className="serif">{t(school.name, locale)}</h1>
          <p className="mono detail__meta">{t(school.period, locale)}</p>
          <p className="detail__tagline">{t(school.tagline, locale)}</p>
        </div>
      </header>

      <p className="prose dropcap">{t(school.description, locale)}</p>

      <h2 className="serif section-h">{t(dict.coreIdeas, locale)}</h2>
      <ul className="list-clean">
        {t(school.coreIdeas, locale).map((idea, i) => (
          <li key={i}>
            <span className="mk">{String(i + 1).padStart(2, '0')}</span>
            <span>{idea}</span>
          </li>
        ))}
      </ul>

      <h2 className="serif section-h">{t(dict.keyThinkers, locale)}</h2>
      <div className="card-grid">
        {sages.map((p) => (
          <Link key={p.slug} href={`/${locale}/philosophers/${p.slug}`} className="index-card">
            <span className="index-card__name serif">{t(p.name, locale)}</span>
            <span className="index-card__meta mono">{t(p.years, locale)}</span>
            <span className="index-card__tagline">{t(p.epithet, locale)}</span>
          </Link>
        ))}
      </div>

      {school.keyWorks && school.keyWorks.length > 0 && (
        <>
          <h2 className="serif section-h">{t(dict.keyWorks, locale)}</h2>
          <ul className="list-clean bib-list">
            {school.keyWorks.map((w, i) => (
              <li key={i} className="bib-item">
                <span className="mk">{String(i + 1).padStart(2, '0')}</span>
                <span className="bib-item__body">
                  <span className="bib-item__title serif">{t(w.title, locale)}</span>
                  <span className="bib-item__meta mono">{t(w.author, locale)} · {w.year}</span>
                  {w.note && <span className="bib-item__note">{t(w.note, locale)}</span>}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
