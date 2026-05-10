import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="eyebrow">iherbs.com.md</p>
          <h2>Контентная витрина для витаминов, минералов, пробиотиков и других популярных добавок</h2>
          <p className="footer-copy">
            Страницы оформлены как полезные подборки: без пустых шаблонов, без технических подсказок и с
            фокусом на понятный выбор продукта перед переходом к карточке товара.
          </p>
        </div>

        <div className="footer-links">
          <Link href="/">Главная</Link>
          <Link href="/#seo-pages">Подборки</Link>
          <Link href="/#categories">Категории</Link>
        </div>
      </div>
    </footer>
  );
}
