import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="eyebrow">iherbs.com.md system</p>
          <h2>Уникальная платформа под storefront, content hubs и long-tail SEO</h2>
          <p className="footer-copy">
            Визуальный стиль специально отстроен как самостоятельный wellness-brand: спокойнее, чище и редакционнее,
            чем у типичных e-commerce витрин.
          </p>
        </div>

        <div className="footer-links">
          <Link href="/">Главная</Link>
          <Link href="/#seo-pages">SEO-страницы</Link>
          <Link href="/#signup">Партнерская программа</Link>
        </div>
      </div>
    </footer>
  );
}
