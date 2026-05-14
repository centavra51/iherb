import type { Locale } from "./i18n";

export type CuratedCard = {
  id: string;
  kind: "product" | "category";
  title: string;
  href: string;
  imageUrl?: string;
  brand: string;
  note: Record<Locale, string>;
};

export type HomeSection = {
  id: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  pageSlugs: string[];
  cardIds: string[];
};

const cards: Record<string, CuratedCard> = {
  "cgn-magnesium-glycinate": {
    id: "cgn-magnesium-glycinate",
    kind: "product",
    title: "California Gold Nutrition Magnesium Glycinate, 180 Veggie Capsules",
    brand: "California Gold Nutrition",
    href: "https://www.iherb.com/pr/california-gold-nutrition-magnesium-glycinate-180-veggie-capsules-133-mg-per-capsule/129685",
    imageUrl:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/spn/spn02357/l/30.jpg",
    note: {
      ru: "Мягкая форма магния, которую часто выбирают для вечернего приема и расслабления.",
      ro: "O forma blanda de magneziu, des aleasa pentru relaxare si rutina de seara."
    }
  },
  "doctors-best-magnesium": {
    id: "doctors-best-magnesium",
    kind: "product",
    title:
      "Doctor's Best High Absorption Magnesium Lysinate Glycinate, 240 Tablets",
    brand: "Doctor's Best",
    href: "https://www.iherb.com/pr/doctor-s-best-high-absorption-magnesium-240-tablets-100-mg-per-tablet/16567",
    imageUrl:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/drb/drb00087/l/214.jpg",
    note: {
      ru: "Популярный магний с хорошей биодоступностью для повседневного приема.",
      ro: "Un magneziu popular, cu absorbtie buna, pentru administrare zilnica."
    }
  },
  "carlson-omega3": {
    id: "carlson-omega3",
    kind: "product",
    title: "Carlson Super Omega-3 Gems, 180 Soft Gels",
    brand: "Carlson",
    href: "https://www.iherb.com/pr/carlson-wild-caught-super-omega-3-gems-180-soft-gels/56805",
    imageUrl:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/car/car01526/l/59.jpg",
    note: {
      ru: "Омега-3 с EPA и DHA для ежедневной поддержки рациона.",
      ro: "Omega-3 cu EPA si DHA pentru sustinerea zilnica a alimentatiei."
    }
  },
  "now-ultra-omega3": {
    id: "now-ultra-omega3",
    kind: "product",
    title: "NOW Foods Ultra Omega-3 Fish Oil, 180 Softgels",
    brand: "NOW Foods",
    href: "https://www.iherb.com/pr/now-foods-ultra-omega-3-fish-oil-180-softgels/8341",
    imageUrl:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/now/now01662/l/76.jpg",
    note: {
      ru: "Концентрированная омега-3 с EPA и DHA для тех, кто хочет понятную ежедневную формулу.",
      ro: "Omega-3 concentrat cu EPA si DHA, potrivit pentru o rutina zilnica clara."
    }
  },
  "cgn-baby-d3": {
    id: "cgn-baby-d3",
    kind: "product",
    title: "California Gold Nutrition Baby Vitamin D3 Drops, 400 IU",
    brand: "California Gold Nutrition",
    href: "https://www.iherb.com/pr/california-gold-nutrition-baby-vitamin-d-3-drops-400-iu-34-fl-oz-10-ml/65958",
    imageUrl:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/cgn/cgn01034/l/139.jpg",
    note: {
      ru: "Жидкий формат D3, который часто выбирают для детей младшего возраста.",
      ro: "Forma lichida de D3, des aleasa pentru copiii mici."
    }
  },
  "nutricost-kids-d3": {
    id: "nutricost-kids-d3",
    kind: "product",
    title: "Nutricost Kids Vitamin D3, 120 Gummies",
    brand: "Nutricost",
    href: "https://www.iherb.com/pr/nutricost-kids-vitamin-d3-ages-4-mixed-berry-62-5-mcg-2-500-iu-120-gummies/129873",
    imageUrl:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ncs/ncs67251/l/18.jpg",
    note: {
      ru: "Жевательный витамин D3 для детей 4+, когда нужен более привычный формат приема.",
      ro: "Vitamina D3 gumata pentru copii 4+, potrivita cand se cauta un format mai usor."
    }
  },
  "cgn-probiotics": {
    id: "cgn-probiotics",
    kind: "product",
    title: "California Gold Nutrition LactoBif 30 Probiotics, 60 Veggie Capsules",
    brand: "California Gold Nutrition",
    href: "https://www.iherb.com/pr/california-gold-nutrition-lactobif-30-probiotics-30-billion-cfu-60-veggie-capsules/64009",
    imageUrl:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/cgn/cgn00965/l/302.jpg",
    note: {
      ru: "Популярный пробиотик для повседневной поддержки пищеварения.",
      ro: "Un probiotic popular pentru sustinerea zilnica a digestiei."
    }
  },
  "jarrow-probiotic": {
    id: "jarrow-probiotic",
    kind: "product",
    title: "Jarrow Formulas Jarro-Dophilus, 50 Billion CFU, 60 Capsules",
    brand: "Jarrow Formulas",
    href: "https://www.iherb.com/pr/jarrow-formulas-jarro-dophilus-50-billion-cfu-60-veggie-capsules/10559",
    imageUrl:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/jrw/jrw03026/l/127.jpg",
    note: {
      ru: "Пробиотик с несколькими штаммами, который часто смотрят для более насыщенной формулы.",
      ro: "Un probiotic cu mai multe tulpini, cautat frecvent pentru o formula mai concentrata."
    }
  },
  "cgn-collagen": {
    id: "cgn-collagen",
    kind: "product",
    title: "California Gold Nutrition Hydrolyzed Collagen Peptides, 200 g",
    brand: "California Gold Nutrition",
    href: "https://www.iherb.com/pr/california-gold-nutrition-hydrolyzed-collagen-peptides-type-i-iii-unflavored-7-05-oz-200-g/102078",
    imageUrl:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/lkn/lkn01872/l/151.jpg",
    note: {
      ru: "Пептиды коллагена в порошке, удобны для смешивания с напитками.",
      ro: "Peptide de colagen sub forma de pulbere, usor de amestecat in bauturi."
    }
  },
  "solgar-gentle-iron": {
    id: "solgar-gentle-iron",
    kind: "product",
    title: "Solgar Gentle Iron, 25 mg, 180 Vegetable Capsules",
    brand: "Solgar",
    href: "https://www.iherb.com/pr/Solgar-Gentle-Iron-25-mg-180-Veggie-Caps/10625",
    imageUrl:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/sol/sol01250/l/132.jpg",
    note: {
      ru: "Мягкая форма железа, которую часто смотрят для ежедневного курса.",
      ro: "O forma blanda de fier, cautata frecvent pentru administrare zilnica."
    }
  },
  "cgn-zinc": {
    id: "cgn-zinc",
    kind: "product",
    title: "California Gold Nutrition Zinc Picolinate, 50 mg, 120 Capsules",
    brand: "California Gold Nutrition",
    href: "https://www.iherb.com/pr/california-gold-nutrition-zinc-picolinate-50-mg-120-veggie-capsules/91976",
    imageUrl:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/cgn/cgn01353/l/147.jpg",
    note: {
      ru: "Цинк пиколинат с понятной дозировкой и удобным форматом капсул.",
      ro: "Zinc picolinat cu doza clara si format comod in capsule."
    }
  },
  "now-zinc": {
    id: "now-zinc",
    kind: "product",
    title: "NOW Foods Zinc, 50 mg, 250 Tablets",
    brand: "NOW Foods",
    href: "https://www.iherb.com/pr/now-foods-zinc-50-mg-250-tablets/883",
    imageUrl:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/now/now01522/l/72.jpg",
    note: {
      ru: "Простой цинк в таблетках для тех, кто хочет сравнить дозировку и объем упаковки.",
      ro: "Zinc simplu in tablete, util pentru compararea dozei si a marimii ambalajului."
    }
  },
  "cgn-b-complex": {
    id: "cgn-b-complex",
    kind: "product",
    title: "California Gold Nutrition B Complex Gummies, 45 Gummies",
    brand: "California Gold Nutrition",
    href: "https://www.iherb.com/pr/california-gold-nutrition-b-complex-gummies-with-vitamins-b6-and-b12-folate-and-biotin-strawberry-45-vegetarian-gummies/82261",
    imageUrl:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/cgn/cgn01201/l/143.jpg",
    note: {
      ru: "B-комплекс в жевательном формате для тех, кому важна простота приема.",
      ro: "Complex de vitamine B in format gumat pentru administrare usoara."
    }
  },
  "naturesplus-adults": {
    id: "naturesplus-adults",
    kind: "product",
    title: "NaturesPlus Adult's Chewable Multivitamin & Mineral, 60 Tablets",
    brand: "NaturesPlus",
    href: "https://www.iherb.com/pr/naturesplus-adult-s-chewable-multivitamin-mineral-exotic-red-berry-60-tablets/121181",
    imageUrl:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/nap/nap30871/l/24.jpg",
    note: {
      ru: "Жевательный мультивитамин для взрослых, когда нужен более простой формат.",
      ro: "Un multivitamin masticabil pentru adulti, usor de luat zilnic."
    }
  },
  "centrum-adults": {
    id: "centrum-adults",
    kind: "product",
    title: "Centrum Adults Multivitamin, 200 Tablets",
    brand: "Centrum",
    href: "https://www.iherb.com/pr/centrum-adults-multivitamins-200-tablets/125279",
    imageUrl:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/cem/cem45174/l/24.jpg",
    note: {
      ru: "Базовый мультивитамин для взрослых с понятной схемой приема.",
      ro: "Un multivitamin de baza pentru adulti, cu administrare simpla."
    }
  },
  "forcefactor-women": {
    id: "forcefactor-women",
    kind: "product",
    title: "Force Factor Women's Multivitamin, 60 Tablets",
    brand: "Force Factor",
    href: "https://www.iherb.com/pr/force-factor-women-s-multivitamin-60-tablets/138241",
    imageUrl:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/foa/foa66016/l/29.jpg",
    note: {
      ru: "Женский мультивитамин с акцентом на ежедневный тонус и базовую поддержку.",
      ro: "Un multivitamin pentru femei, orientat spre energie si suport zilnic."
    }
  },
  "vitacost-mens": {
    id: "vitacost-mens",
    kind: "product",
    title: "Vitacost Synergy Men's Multivitamin, 180 Capsules",
    brand: "Vitacost",
    href: "https://www.iherb.com/pr/vitacost-synergy-men-s-multivitamin-180-capsules/158712",
    note: {
      ru: "Мужской мультивитамин с широким составом для ежедневной поддержки.",
      ro: "Un multivitamin pentru barbati, cu formula ampla pentru utilizare zilnica."
    }
  },
  "now-ucii": {
    id: "now-ucii",
    kind: "product",
    title: "NOW Foods UC-II Joint Health, 60 Capsules",
    brand: "NOW Foods",
    href: "https://www.iherb.com/pr/now-foods-uc-ii-60-veggie-caps/16572",
    imageUrl:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/now/now03134/l/54.jpg",
    note: {
      ru: "Вариант для тех, кто смотрит поддержку комфорта и подвижности суставов.",
      ro: "O optiune pentru cei care cauta suport pentru confortul si mobilitatea articulatiilor."
    }
  },
  "browse-omega": {
    id: "browse-omega",
    kind: "category",
    title: "Все варианты Omega-3 на iHerb",
    brand: "iHerb",
    href: "https://www.iherb.com/c/omega-3-fish-oil",
    imageUrl:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/car/car01526/l/59.jpg",
    note: {
      ru: "Если нужен более широкий выбор по форме, дозировке и размеру упаковки.",
      ro: "Daca vrei o selectie mai larga dupa forma, doza si marimea ambalajului."
    }
  },
  "browse-d3-kids": {
    id: "browse-d3-kids",
    kind: "category",
    title: "Все детские витамин D3 на iHerb",
    brand: "iHerb",
    href: "https://www.iherb.com/c/childrens-vitamin-d",
    imageUrl:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/cgn/cgn01034/l/139.jpg",
    note: {
      ru: "Раздел с каплями, жевательными формами и другими вариантами для детей.",
      ro: "Sectiune cu picaturi, forme masticabile si alte variante pentru copii."
    }
  },
  "browse-probiotics": {
    id: "browse-probiotics",
    kind: "category",
    title: "Смотреть категорию пробиотиков на iHerb",
    brand: "iHerb",
    href: "https://www.iherb.com/c/probiotics",
    imageUrl:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/cgn/cgn00965/l/302.jpg",
    note: {
      ru: "Когда хочется посмотреть больше штаммов, форматов и размеров упаковки.",
      ro: "Cand vrei sa vezi mai multe tulpini, formate si marimi de ambalaj."
    }
  },
  "browse-joints": {
    id: "browse-joints",
    kind: "category",
    title: "Смотреть всё для суставов на iHerb",
    brand: "iHerb",
    href: "https://www.iherb.com/c/bone-joint-cartilage",
    imageUrl:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/now/now03134/l/54.jpg",
    note: {
      ru: "Раздел с коллагеном, UC-II, глюкозамином и комплексами для суставов.",
      ro: "Sectiune cu colagen, UC-II, glucozamina si formule complexe pentru articulatii."
    }
  },
  "browse-collagen": {
    id: "browse-collagen",
    kind: "category",
    title: "Смотреть коллаген на iHerb",
    brand: "iHerb",
    href: "https://www.iherb.com/c/collagen-supplements",
    imageUrl:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/lkn/lkn01872/l/151.jpg",
    note: {
      ru: "Подходит, если нужен выбор между порошком, капсулами и разными дозировками.",
      ro: "Potrivit daca vrei sa alegi intre pudra, capsule si doze diferite."
    }
  },
  "browse-iron": {
    id: "browse-iron",
    kind: "category",
    title: "Смотреть железо на iHerb",
    brand: "iHerb",
    href: "https://www.iherb.com/c/iron",
    imageUrl:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/sol/sol01250/l/132.jpg",
    note: {
      ru: "Раздел для сравнения разных форм железа и размеров упаковки.",
      ro: "Sectiune pentru compararea diferitelor forme de fier si marimi de ambalaj."
    }
  },
  "browse-zinc": {
    id: "browse-zinc",
    kind: "category",
    title: "Смотреть цинк на iHerb",
    brand: "iHerb",
    href: "https://www.iherb.com/c/zinc",
    imageUrl:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/cgn/cgn01353/l/147.jpg",
    note: {
      ru: "Полезно, если хочется сравнить капсулы, леденцы и комплексные формулы.",
      ro: "Util daca vrei sa compari capsule, pastile de supt si formule complexe."
    }
  },
  "browse-b-complex": {
    id: "browse-b-complex",
    kind: "category",
    title: "Смотреть B-комплексы на iHerb",
    brand: "iHerb",
    href: "https://www.iherb.com/c/vitamin-b-complex",
    imageUrl:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/cgn/cgn01201/l/143.jpg",
    note: {
      ru: "Раздел с B-комплексами в таблетках, капсулах и жевательных формах.",
      ro: "Sectiune cu complexe de vitamine B in tablete, capsule si forme gumate."
    }
  },
  "mens-health-category": {
    id: "mens-health-category",
    kind: "category",
    title: "Мужское здоровье на iHerb",
    brand: "iHerb",
    href: "https://www.iherb.com/c/mens-health",
    note: {
      ru: "Подборки и товары, которые часто смотрят мужчины: мультивитамины, минералы и ежедневная поддержка.",
      ro: "Selectii si produse cautate frecvent de barbati: multivitamine, minerale si suport zilnic."
    }
  },
  "womens-health-category": {
    id: "womens-health-category",
    kind: "category",
    title: "Женское здоровье на iHerb",
    brand: "iHerb",
    href: "https://www.iherb.com/c/womens-health",
    note: {
      ru: "Раздел с женскими мультивитаминами, железом и другими повседневными формулами.",
      ro: "Sectiune cu multivitamine pentru femei, fier si alte formule de uz zilnic."
    }
  }
};

const pageCardIds: Record<string, string[]> = {
  "magniy-dlya-sna": [
    "cgn-magnesium-glycinate",
    "doctors-best-magnesium",
    "cgn-b-complex"
  ],
  "omega-3-dlya-zhenshchin": [
    "carlson-omega3",
    "now-ultra-omega3",
    "browse-omega"
  ],
  "vitamin-d3-dlya-detey": ["cgn-baby-d3", "nutricost-kids-d3", "browse-d3-kids"],
  "probiotiki-posle-antibiotikov": ["cgn-probiotics", "jarrow-probiotic", "browse-probiotics"],
  "kollagen-dlya-sustavov": ["cgn-collagen", "now-ucii", "browse-collagen"],
  "zhelezo-dlya-zhenshchin": [
    "solgar-gentle-iron",
    "forcefactor-women",
    "browse-iron"
  ],
  "tsink-dlya-immuniteta": ["cgn-zinc", "now-zinc", "browse-zinc"],
  "vitamin-b-kompleks-dlya-energii": [
    "cgn-b-complex",
    "centrum-adults",
    "browse-b-complex"
  ]
};

export const homeSections: HomeSection[] = [
  {
    id: "for-women",
    title: {
      ru: "Для женщин",
      ro: "Pentru femei"
    },
    description: {
      ru: "Быстрый вход в темы, которые чаще всего смотрят женщины: омега-3, железо и повседневные комплексы.",
      ro: "Acces rapid la teme cautate frecvent de femei: omega-3, fier si complexe zilnice."
    },
    pageSlugs: ["omega-3-dlya-zhenshchin", "zhelezo-dlya-zhenshchin"],
    cardIds: ["forcefactor-women", "solgar-gentle-iron", "womens-health-category"]
  },
  {
    id: "for-men",
    title: {
      ru: "Для мужчин",
      ro: "Pentru barbati"
    },
    description: {
      ru: "Простые варианты для ежедневной базы: мультивитамины, цинк и омега-3.",
      ro: "Optiuni simple pentru rutina zilnica: multivitamine, zinc si omega-3."
    },
    pageSlugs: ["tsink-dlya-immuniteta", "vitamin-b-kompleks-dlya-energii"],
    cardIds: ["vitacost-mens", "cgn-zinc", "mens-health-category"]
  },
  {
    id: "for-adults",
    title: {
      ru: "18+",
      ro: "18+"
    },
    description: {
      ru: "Раздел для взрослых с базовыми мультивитаминами и понятными формами ежедневного приема.",
      ro: "Sectiune pentru adulti, cu multivitamine de baza si formate usor de administrat zilnic."
    },
    pageSlugs: ["vitamin-b-kompleks-dlya-energii", "tsink-dlya-immuniteta"],
    cardIds: ["centrum-adults", "naturesplus-adults", "cgn-b-complex"]
  },
  {
    id: "for-back",
    title: {
      ru: "Для спины",
      ro: "Pentru spate"
    },
    description: {
      ru: "Чаще всего здесь ищут магний, коллаген и поддержку суставов без лишней перегрузки страницы.",
      ro: "Aici sunt cautate frecvent magneziul, colagenul si suportul pentru articulatii."
    },
    pageSlugs: ["magniy-dlya-sna", "kollagen-dlya-sustavov"],
    cardIds: ["cgn-magnesium-glycinate", "cgn-collagen", "browse-joints"]
  },
  {
    id: "for-joints",
    title: {
      ru: "Для суставов",
      ro: "Pentru articulatii"
    },
    description: {
      ru: "Подборки и товары для тех, кто хочет быстро посмотреть коллаген и популярные формулы для суставов.",
      ro: "Selectii si produse pentru cei care vor sa compare rapid colagenul si formulele populare pentru articulatii."
    },
    pageSlugs: ["kollagen-dlya-sustavov"],
    cardIds: ["now-ucii", "cgn-collagen", "browse-joints"]
  }
];

export function getCuratedCards(ids: string[]) {
  return ids.map((id) => cards[id]).filter(Boolean);
}

export function getCardsForPage(slug: string, sourceUrl?: string, imageUrl?: string) {
  const curated = getCuratedCards(pageCardIds[slug] ?? []);

  if (sourceUrl?.trim() && !curated.some((card) => card.href === sourceUrl.trim())) {
    curated.push({
      id: `${slug}-browse`,
      kind: "category",
      title: "Открыть подборку на iHerb",
      brand: "iHerb",
      href: sourceUrl.trim(),
      imageUrl,
      note: {
        ru: "Если хочется посмотреть больше вариантов внутри этой категории на iHerb.",
        ro: "Daca vrei sa vezi mai multe variante din aceasta categorie pe iHerb."
      }
    });
  }

  return curated;
}
