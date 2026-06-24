/**
 * Lightweight internationalization layer.
 *
 * Every piece of content in the app is stored as a `Localized<T>` record
 * keyed by locale, so adding a new language only requires extending the
 * `LOCALES` tuple and filling in the new key across the data files
 * (TypeScript will point out every missing translation at compile time).
 */
export const LOCALES = ['en', 'pt'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export type Localized<T = string> = Record<Locale, T>;

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Resolves a localized record for the given locale, falling back to the default. */
export function t<T>(localized: Localized<T>, locale: Locale): T {
  return localized[locale] ?? localized[DEFAULT_LOCALE];
}

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  pt: 'Português (BR)',
};

export const LOCALE_HTML_LANG: Record<Locale, string> = {
  en: 'en',
  pt: 'pt-BR',
};
