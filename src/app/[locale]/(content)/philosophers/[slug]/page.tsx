import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { dict } from '@/data/dictionary';
import { philosophers, getPhilosopher } from '@/data/philosophers';
import { getSchool } from '@/data/schools';
import { isLocale, LOCALES, t, type Locale } from '@/lib/i18n';

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => philosophers.map((p) => ({ locale, slug: p.slug })));
}

export function generateMetadata({ params }: { params: { locale: string; slug: string } }): Metadata {
  const locale: Locale = isLocale(params.locale) ? params.locale : 'en';
  const p = getPhilosopher(params.slug);
  return { title: p ? t(p.name, locale) : t(dict.philosophers, locale) };
}

export default function PhilosopherPage({ params }: { params: { locale: Locale; slug: string } }) {
  const { locale, slug } = params;
  const p = getPhilosopher(slug);
  if (!p) notFound();

  return (
    <main className="detail">
      <header className="detail__head">
        <div>
          <h1 className="serif">{t(p.name, locale)}</h1>
          <p className="mono detail__meta">{t(p.epithet, locale)} · {t(p.years, locale)}</p>
          <p className="detail__tagline">{t(dict.born, locale)} {t(p.birthplace, locale)}</p>
          <p className="mono detail__schools">
            {p.schoolSlugs.map((s) => {
              const school = getSchool(s);
              return school ? (
                <Link key={s} href={`/${locale}/schools/${s}`} className="schoollink">
                  {school.emblem} {t(school.name, locale)}
                </Link>
              ) : null;
            })}
          </p>
        </div>
      </header>

      <h2 className="serif section-h">{t(dict.biography, locale)}</h2>
      <div className="prose dropcap">
        {t(p.biography, locale).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <h2 className="serif section-h">{t(dict.contributions, locale)}</h2>
      <ul className="list-clean">
        {t(p.contributions, locale).map((c, i) => (
          <li key={i}>
            <span className="mk">{String(i + 1).padStart(2, '0')}</span>
            <span>{c}</span>
          </li>
        ))}
      </ul>

      <h2 className="serif section-h">{t(dict.notableQuotes, locale)}</h2>
      <div className="quotes">
        {p.quotes.map((q, i) => (
          <blockquote key={i} className="quote">“{t(q.text, locale)}”</blockquote>
        ))}
      </div>

      <h2 className="serif section-h">{t(dict.remarkableFacts, locale)}</h2>
      <ul className="list-clean">
        {t(p.facts, locale).map((f, i) => (
          <li key={i}>
            <span className="mk">{String(i + 1).padStart(2, '0')}</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
