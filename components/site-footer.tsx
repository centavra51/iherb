import Link from "next/link";
import { getLocalePath, type Locale } from "../lib/i18n";

const labels = {
  ru: {
    title: "Понятные подборки витаминов и добавок для повседневного выбора",
    copy:
      "На сайте собраны короткие подборки с простыми описаниями, чтобы человек мог быстро перейти к нужной теме и открыть подходящие товары на iHerb.",
    home: "Главная",
    pages: "Подборки",
    women: "Для женщин",
    men: "Для мужчин",
    adults: "18+",
    back: "Для спины",
    joints: "Для суставов"
  },
  ro: {
    title: "Selectii clare de vitamine si suplimente pentru alegerea de zi cu zi",
    copy:
      "Site-ul aduna selectii scurte si usor de parcurs, pentru ca vizitatorul sa ajunga rapid la tema potrivita si la produsele relevante de pe iHerb.",
    home: "Acasa",
    pages: "Selectii",
    women: "Pentru femei",
    men: "Pentru barbati",
    adults: "18+",
    back: "Pentru spate",
    joints: "Pentru articulatii"
  }
} as const;

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = labels[locale];
  const base = getLocalePath(locale);

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="eyebrow">iherbs.com.md</p>
          <h2>{copy.title}</h2>
          <p className="footer-copy">{copy.copy}</p>
        </div>

        <div className="footer-links">
          <Link href={base}>{copy.home}</Link>
          <Link href={`${base}#seo-pages`}>{copy.pages}</Link>
          <a href={`${base}#for-women`}>{copy.women}</a>
          <a href={`${base}#for-men`}>{copy.men}</a>
          <a href={`${base}#for-adults`}>{copy.adults}</a>
          <a href={`${base}#for-back`}>{copy.back}</a>
          <a href={`${base}#for-joints`}>{copy.joints}</a>
        </div>
      </div>
    </footer>
  );
}
