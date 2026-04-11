import Link from "next/link";

type SiteHeaderProps = {
  compact?: boolean;
};

export function SiteHeader({ compact = false }: SiteHeaderProps) {
  if (compact) {
    return (
      <header className="page-header">
        <div className="wrap topbar">
          <Link className="brand" href="/">
            iherbs.com.md
          </Link>
          <nav className="topnav" aria-label="Главная навигация">
            <Link href="/">Главная</Link>
            <Link href="/#seo-pages">SEO-страницы</Link>
            <Link href="/#signup">Партнерская программа</Link>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="site-header">
      <div className="header-main-shell">
        <div className="shell header-main">
          <Link className="logo" href="/">
            <span className="logo-mark">V</span>
            <span className="logo-text">iherbs.com.md</span>
          </Link>

          <div className="searchbar">
            <input
              aria-label="Поиск"
              placeholder="Поиск по офферам, категориям и промо-материалам"
              readOnly
            />
            <span className="search-icon">⌕</span>
          </div>

          <div className="header-actions">
            <Link href="#signup">Войти</Link>
            <Link href="#signup">Кабинет</Link>
            <Link href="#signup" className="cart-badge">
              0
            </Link>
          </div>
        </div>
      </div>

      <div className="header-nav-wrap">
        <div className="shell header-nav">
          <a href="#supplements">Пищевые добавки</a>
          <a href="#bestsellers">Спорт</a>
          <a href="#categories">Личная гигиена</a>
          <a href="#bestsellers">Красота</a>
          <a href="#seo-pages">SEO-страницы</a>
          <a href="#guarantee">Здоровый дом</a>
          <a href="#signup">Для партнеров</a>
        </div>
      </div>
    </header>
  );
}
