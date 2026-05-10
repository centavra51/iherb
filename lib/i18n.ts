export const locales = ["ru", "ro"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ru";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocalePath(locale: Locale, slug?: string) {
  if (!slug) {
    return `/${locale}/`;
  }

  return `/${locale}/${slug}/`;
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "ru" ? "ro" : "ru";
}

export function getLanguageName(locale: Locale) {
  return locale === "ru" ? "Русский" : "Romana";
}

export function getLanguageShortLabel(locale: Locale) {
  return locale.toUpperCase();
}
