import Link from "next/link";
import { getAlternateLocale, getLanguageName, getLanguageShortLabel, getLocalePath, type Locale } from "../lib/i18n";

type SiteHeaderProps = {
  compact?: boolean;
  locale: Locale;
  slug?: string;
};

const labels = {
  ru: {
    navAria: "Главная навигация",
    home: "Главная",
    pages: "Подборки",
    categories: "Категории",
    guide: "Гид",
    searchPlaceholder: "Поиск по витаминам, минералам и БАДам",
    popular: "Популярные страницы",
    vitamins: "Витамины",
    minerals: "Минералы",
    fats: "Омега и жирные кислоты",
    probiotics: "Пробиотики",
    howToChoose: "Как выбирать",
    offers: "Для офферов"
  },
  ro: {
    navAria: "Navigatie principala",
    home: "Acasa",
    pages: "Selectii",
    categories: "Categorii",
    guide: "Ghid",
    searchPlaceholder: "Cauta vitamine, minerale si suplimente",
    popular: "Pagini populare",
    vitamins: "Vitamine",
    minerals: "Minerale",
    fats: "Omega si acizi grasi",
    probiotics: "Probiotice",
    howToChoose: "Cum alegi",
    offers: "Pentru oferte"
  }
} as const;

function LanguageSwitcher({ locale, slug }: { locale: Locale; slug?: string }) {
  const alternateLocale = getAlternateLocale(locale);
  const currentPath = getLocalePath(locale, slug);
  const alternatePath = getLocalePath(alternateLocale, slug);

  return (
    <div className="language-switcher" aria-label="Language switcher">
      <Link className="language-chip is-active" href={currentPath}>
        {getLanguageShortLabel(locale)}
      </Link>
      <Link className="language-chip" href={alternatePath}>
        {getLanguageName(alternateLocale)}
      </Link>
    </div>
  );
}

export function SiteHeader({ compact = false, locale, slug }: SiteHeaderProps) {
  const copy = labels[locale];

  if (compact) {
    return (
      <header className="page-header">
        <div className="wrap topbar">
          <Link className="brand" href={getLocalePath(locale)}>
            iherbs.com.md
          </Link>
          <nav className="topnav" aria-label={copy.navAria}>
            <Link href={getLocalePath(locale)}>{copy.home}</Link>
            <Link href={`${getLocalePath(locale)}#seo-pages`}>{copy.pages}</Link>
            <Link href={`${getLocalePath(locale)}#categories`}>{copy.categories}</Link>
          </nav>
          <LanguageSwitcher locale={locale} slug={slug} />
        </div>
      </header>
    );
  }

  return (
    <header className="site-header">
      <div className="header-main-shell">
        <div className="shell header-main">
          <Link className="logo" href={getLocalePath(locale)}>
            <span className="logo-mark">V</span>
            <span className="logo-text">iherbs.com.md</span>
          </Link>

          <div className="searchbar">
            <input aria-label={copy.searchPlaceholder} placeholder={copy.searchPlaceholder} readOnly />
            <span className="search-icon">⌕</span>
          </div>

          <div className="header-actions">
            <Link href={`${getLocalePath(locale)}#seo-pages`}>{copy.pages}</Link>
            <Link href={`${getLocalePath(locale)}#categories`}>{copy.categories}</Link>
            <Link href={`${getLocalePath(locale)}#guide`} className="cart-badge">
              {copy.guide}
            </Link>
            <LanguageSwitcher locale={locale} slug={slug} />
          </div>
        </div>
      </div>

      <div className="header-nav-wrap">
        <div className="shell header-nav">
          <a href={`${getLocalePath(locale)}#seo-pages`}>{copy.popular}</a>
          <a href={`${getLocalePath(locale)}#categories`}>{copy.vitamins}</a>
          <a href={`${getLocalePath(locale)}#categories`}>{copy.minerals}</a>
          <a href={`${getLocalePath(locale)}#categories`}>{copy.fats}</a>
          <a href={`${getLocalePath(locale)}#categories`}>{copy.probiotics}</a>
          <a href={`${getLocalePath(locale)}#guide`}>{copy.howToChoose}</a>
          <a href={`${getLocalePath(locale)}#signup`}>{copy.offers}</a>
        </div>
      </div>
    </header>
  );
}
