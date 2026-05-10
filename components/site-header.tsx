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
            <Link href="/#seo-pages">Подборки</Link>
            <Link href="/#categories">Категории</Link>
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
            <input aria-label="Поиск" placeholder="Поиск по витаминам, минералам и БАДам" readOnly />
            <span className="search-icon">⌕</span>
          </div>

          <div className="header-actions">
            <Link href="#seo-pages">Подборки</Link>
            <Link href="#categories">Категории</Link>
            <Link href="#guide" className="cart-badge">
              Гид
            </Link>
          </div>
        </div>
      </div>

      <div className="header-nav-wrap">
        <div className="shell header-nav">
          <a href="#seo-pages">Популярные страницы</a>
          <a href="#categories">Витамины</a>
          <a href="#categories">Минералы</a>
          <a href="#categories">Омега и жирные кислоты</a>
          <a href="#categories">Пробиотики</a>
          <a href="#guide">Как выбирать</a>
          <a href="#signup">Для офферов</a>
        </div>
      </div>
    </header>
  );
}
