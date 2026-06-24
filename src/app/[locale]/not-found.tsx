import Link from 'next/link';
import { dict } from '@/data/dictionary';
import { DEFAULT_LOCALE, t } from '@/lib/i18n';

export default function NotFound() {
  const locale = DEFAULT_LOCALE;
  return (
    <div className="notfound">
      <span className="notfound__glyph brush" aria-hidden="true">無</span>
      <h1 className="serif">{t(dict.notFoundTitle, locale)}</h1>
      <p>{t(dict.notFoundBody, locale)}</p>
      <Link className="btn-primary" href={`/${locale}`}>
        {t(dict.goHome, locale)}
      </Link>
    </div>
  );
}
