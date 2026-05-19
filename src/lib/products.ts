import { catalogSeeds, categoryVisuals, showroomBanner } from "./images";

export { showroomBanner };

export type Category = {
  slug: string;
  name: string;
  image: string;
  banner: string;
  blurb: string;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  gallery: string[];
  description: string;
  specs: { label: string; value: string }[];
};

const categoryMeta: { slug: string; name: string; blurb: string }[] = [
  { slug: "floor-tiles", name: "Floor Tiles", blurb: "Durable, elegant floor tiles for every room." },
  { slug: "wall-tiles", name: "Wall Tiles", blurb: "Statement wall tiles that elevate any interior." },
  { slug: "kitchen-tiles", name: "Kitchen Tiles", blurb: "Stain-resistant, beautiful kitchen tiles." },
  { slug: "bathroom-tiles", name: "Bathroom Tiles", blurb: "Spa-worthy bathroom tile collections." },
  { slug: "basins", name: "Basins", blurb: "Designer basins in every shape and finish." },
  { slug: "commodes", name: "Commodes", blurb: "Modern commodes engineered for comfort." },
  { slug: "taps", name: "Taps", blurb: "Premium taps with lasting brilliance." },
  { slug: "sinks", name: "Sinks", blurb: "Kitchen sinks built for everyday excellence." },
];

export const categories: Category[] = categoryMeta.map((c) => {
  const v = categoryVisuals[c.slug];
  return { ...c, image: v.thumb, banner: v.banner };
});

const specsByCategory: Record<string, { label: string; value: string }[]> = {
  "floor-tiles": [
    { label: "Material", value: "Vitrified Porcelain" },
    { label: "Size", value: "600 × 600 mm" },
    { label: "Finish", value: "Glossy / Matte" },
    { label: "Coverage", value: "4 tiles per box" },
  ],
  "wall-tiles": [
    { label: "Material", value: "Ceramic" },
    { label: "Size", value: "300 × 600 mm" },
    { label: "Finish", value: "Glossy / Matte" },
    { label: "Use", value: "Interior walls" },
  ],
  "kitchen-tiles": [
    { label: "Material", value: "Ceramic" },
    { label: "Size", value: "300 × 600 mm" },
    { label: "Finish", value: "Glossy" },
    { label: "Feature", value: "Stain resistant" },
  ],
  "bathroom-tiles": [
    { label: "Material", value: "Ceramic" },
    { label: "Size", value: "300 × 600 mm" },
    { label: "Finish", value: "Glossy" },
    { label: "Use", value: "Wet areas" },
  ],
  basins: [
    { label: "Material", value: "Ceramic" },
    { label: "Mount", value: "Wall / Pedestal / Counter" },
    { label: "Colour", value: "White" },
    { label: "Brand", value: "Saha Select" },
  ],
  commodes: [
    { label: "Material", value: "Ceramic" },
    { label: "Type", value: "One-piece / Wall-hung" },
    { label: "Flush", value: "Dual flush" },
    { label: "Brand", value: "Saha Select" },
  ],
  taps: [
    { label: "Material", value: "Brass with chrome finish" },
    { label: "Type", value: "Basin mixer / Pillar" },
    { label: "Finish", value: "Chrome / Brass" },
    { label: "Brand", value: "Saha Select" },
  ],
  sinks: [
    { label: "Material", value: "Stainless steel / Composite" },
    { label: "Bowls", value: "Single / Double" },
    { label: "Mount", value: "Top / Undermount" },
    { label: "Brand", value: "Saha Select" },
  ],
};

const make = (
  category: string,
  seeds: { name: string; image: string; gallery: string[] }[],
  basePrice: number,
): Product[] =>
  seeds.map((seed, i) => {
    const price = basePrice + i * 120 + ((i * 37) % 80);
    const oldPrice = Math.round(price * (1.15 + (i % 3) * 0.05));
    return {
      slug: `${category}-${i + 1}-${seed.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`.slice(0, 80),
      name: seed.name,
      category,
      price,
      oldPrice,
      rating: 4 + (i % 2 ? 0.5 : 0),
      reviews: 12 + i * 7,
      image: seed.image,
      gallery: seed.gallery,
      description: `${seed.name} from Saha Traders — crafted for durability, designed for elegance. Sourced from premium manufacturers and finished to perfection for long-lasting beauty in your space.`,
      specs: specsByCategory[category] ?? [],
    };
  });

const basePrices: Record<string, number> = {
  "floor-tiles": 480,
  "wall-tiles": 520,
  "kitchen-tiles": 560,
  "bathroom-tiles": 540,
  basins: 2200,
  commodes: 6800,
  taps: 1200,
  sinks: 3200,
};

export const products: Product[] = Object.entries(catalogSeeds).flatMap(([slug, seeds]) =>
  make(slug, seeds, basePrices[slug] ?? 500),
);

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getProductsByCategory = (slug: string) => products.filter((p) => p.category === slug);
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getFeatured = () =>
  categories.map((c) => products.find((p) => p.category === c.slug)!).filter(Boolean);

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
