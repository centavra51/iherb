import Image from "next/image";
import type { Locale } from "../lib/i18n";
import type { CuratedCard } from "../lib/curated-products";

const copy = {
  ru: {
    productCta: "Купить на iHerb",
    categoryCta: "Открыть раздел iHerb"
  },
  ro: {
    productCta: "Cumpara pe iHerb",
    categoryCta: "Deschide categoria iHerb"
  }
} as const;

type ProductShelfProps = {
  cards: CuratedCard[];
  locale: Locale;
};

export function ProductShelf({ cards, locale }: ProductShelfProps) {
  if (cards.length === 0) {
    return null;
  }

  const labels = copy[locale];

  return (
    <div className="product-grid">
      {cards.map((card) => (
        <article className="product-card" key={card.id}>
          <div className="product-card-media">
            {card.imageUrl ? (
              <Image src={card.imageUrl} alt={card.title} fill sizes="(max-width: 980px) 100vw, 340px" />
            ) : (
              <div className="image-fallback">
                <span>{card.title}</span>
              </div>
            )}
          </div>

          <div className="product-card-copy">
            <p className="product-brand">{card.brand}</p>
            <h3>{card.title}</h3>
            <p>{card.note[locale]}</p>
          </div>

          <a
            className="button button-primary"
            href={card.href}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
          >
            {card.kind === "product" ? labels.productCta : labels.categoryCta}
          </a>
        </article>
      ))}
    </div>
  );
}
