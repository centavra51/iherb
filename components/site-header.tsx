import Link from "next/link";
import {
  getAlternateLocale,
  getLanguageName,
  getLanguageShortLabel,
  getLocalePath,
  type Locale
} from "../lib/i18n";

type SiteHeaderProps = {
  compact?: boolean;
  locale: Locale;
  slug?: string;
};

const labels = {
  ru: {
    navAria: "Основная навигация",
    home: "Главная",
    pages: "Подборки",
    women: "Для женщин",
    men: "Для мужчин",
    adults: "18+",
    back: "Для спины",
    joints: "Для суставов"
  },
  ro: {
    navAria: "Navigatie principala",
    home: "Acasa",
    pages: "Selectii",
    women: "Pentru femei",
    men: "Pentru barbati",
    adults: "18+",
    back: "Pentru spate",
    joints: "Pentru articulatii"
  }
} as const;

const sectionAnchors = ["for-women", "for-men", "for-adults", "for-back", "for-joints"] as const;

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

function MenuLinks({ locale }: { locale: Locale }) {
  const copy = labels[locale];
  const base = getLocalePath(locale);

  return (
    <>
      <Link href={`${base}#seo-pages`}>{copy.pages}</Link>
      <a href={`${base}#${sectionAnchors[0]}`}>{copy.women}</a>
      <a href={`${base}#${sectionAnchors[1]}`}>{copy.men}</a>
      <a href={`${base}#${sectionAnchors[2]}`}>{copy.adults}</a>
      <a href={`${base}#${sectionAnchors[3]}`}>{copy.back}</a>
      <a href={`${base}#${sectionAnchors[4]}`}>{copy.joints}</a>
    </>
  );
}

export function SiteHeader({ compact = false, locale, slug }: SiteHeaderProps) {
  const copy = labels[locale];

  if (compact) {
    return (
      <header className="page-header">
        <div className="wrap topbar compact-topbar">
          <Link className="brand" href={getLocalePath(locale)}>
            iherbs.com.md
          </Link>
          <nav className="topnav" aria-label={copy.navAria}>
            <Link href={getLocalePath(locale)}>{copy.home}</Link>
            <MenuLinks locale={locale} />
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
            <span className="logo-mark" aria-hidden="true">
              <span className="logo-branch" />
              <span className="logo-leaf leaf-one" />
              <span className="logo-leaf leaf-two" />
              <span className="logo-leaf leaf-three" />
            </span>
            <span className="logo-text">iherbs.com.md</span>
          </Link>

          <nav className="header-actions" aria-label={copy.navAria}>
            <Link href={getLocalePath(locale)}>{copy.home}</Link>
            <MenuLinks locale={locale} />
          </nav>

          <LanguageSwitcher locale={locale} slug={slug} />
        </div>
      </div>
    </header>
  );
}
