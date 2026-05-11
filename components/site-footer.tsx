import Link from "next/link";
import { getLocalePath, type Locale } from "../lib/i18n";

const labels = {
  ru: {
    title: "Подборки витаминов, минералов, пробиотиков и других популярных добавок",
    copy:
      "Страницы оформлены как полезные подборки с понятными объяснениями, краткими советами по выбору и удобными переходами между похожими темами.",
    home: "Главная",
    pages: "Подборки",
    categories: "Категории"
  },
  ro: {
    title: "Selectii de vitamine, minerale, probiotice si alte suplimente populare",
    copy:
      "Paginile sunt construite ca selectii utile, cu explicatii clare, sfaturi scurte pentru alegere si treceri usoare intre teme asemanatoare.",
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
