import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Topbar } from '@/components/Topbar';
import { dict } from '@/data/dictionary';
import { isLocale, t, type Locale } from '@/lib/i18n';

export default function ContentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  return (
    <div className="stage">
      <Topbar locale={locale} />
      <div className="content-page">
        <Link className="backlink mono" href={`/${locale}`}>
          ← {t(dict.home, locale)}
        </Link>
        {children}
      </div>
    </div>
  );
}
