import Link from "next/link";
import { getLocalePath, type Locale } from "../lib/i18n";

const labels = {
  ru: {
    title: "Контентная витрина для витаминов, минералов, пробиотиков и других популярных добавок",
    copy:
      "Страницы оформлены как полезные подборки: без пустых шаблонов, без технических подсказок и с фокусом на понятный выбор продукта перед переходом к карточке товара.",
    home: "Главная",
    pages: "Подборки",
    categories: "Категории"
  },
  ro: {
    title: "Vitrina de continut pentru vitamine, minerale, probiotice si alte suplimente populare",
    copy:
      "Paginile sunt construite ca selectii utile, fara sabloane goale si fara text tehnic inutil, cu accent pe alegerea clara a produsului inainte de trecerea la oferta.",
    home: "Acasa",
    pages: "Selectii",
    categories: "Categorii"
  }
} as const;

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = labels[locale];

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="eyebrow">iherbs.com.md</p>
          <h2>{copy.title}</h2>
          <p className="footer-copy">{copy.copy}</p>
        </div>

        <div className="footer-links">
          <Link href={getLocalePath(locale)}>{copy.home}</Link>
          <Link href={`${getLocalePath(locale)}#seo-pages`}>{copy.pages}</Link>
          <Link href={`${getLocalePath(locale)}#categories`}>{copy.categories}</Link>
        </div>
      </div>
    </footer>
  );
}
