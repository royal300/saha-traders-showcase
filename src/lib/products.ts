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
  category: string; // category slug
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  gallery: string[];
  description: string;
  specs: { label: string; value: string }[];
};

const ux = (q: string, w = 800, h = 800) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

// Real Unsplash photo IDs hand-picked per category
export const categories: Category[] = [
  {
    slug: "floor-tiles",
    name: "Floor Tiles",
    image: ux("photo-1615873968403-89e068629265"),
    banner: ux("photo-1615874959474-d609969a20ed", 1600, 600),
    blurb: "Durable, elegant floor tiles for every room.",
  },
  {
    slug: "wall-tiles",
    name: "Wall Tiles",
    image: ux("photo-1600585154526-990dced4db0d"),
    banner: ux("photo-1600566753190-17f0baa2a6c3", 1600, 600),
    blurb: "Statement wall tiles that elevate any interior.",
  },
  {
    slug: "kitchen-tiles",
    name: "Kitchen Tiles",
    image: ux("photo-1556909114-f6e7ad7d3136"),
    banner: ux("photo-1556909172-54557c7e4fb7", 1600, 600),
    blurb: "Stain-resistant, beautiful kitchen tiles.",
  },
  {
    slug: "bathroom-tiles",
    name: "Bathroom Tiles",
    image: ux("photo-1552321554-5fefe8c9ef14"),
    banner: ux("photo-1564540583246-934409427776", 1600, 600),
    blurb: "Spa-worthy bathroom tile collections.",
  },
  {
    slug: "basins",
    name: "Basins",
    image: ux("photo-1604061986761-d9d0cc41b0d1"),
    banner: ux("photo-1620626011761-996317b8d101", 1600, 600),
    blurb: "Designer basins in every shape and finish.",
  },
  {
    slug: "commodes",
    name: "Commodes",
    image: ux("photo-1631679706909-1844bbd07221"),
    banner: ux("photo-1552321554-5fefe8c9ef14", 1600, 600),
    blurb: "Modern commodes engineered for comfort.",
  },
  {
    slug: "taps",
    name: "Taps",
    image: ux("photo-1584622650111-993a426fbf0a"),
    banner: ux("photo-1581858726788-75bc0f6a952d", 1600, 600),
    blurb: "Premium taps with lasting brilliance.",
  },
  {
    slug: "sinks",
    name: "Sinks",
    image: ux("photo-1556909114-44e3e70034e2"),
    banner: ux("photo-1556909172-89d99c1d3e6f", 1600, 600),
    blurb: "Kitchen sinks built for everyday excellence.",
  },
];

const galleryFor = (img: string): string[] => [
  img,
  img.replace(/w=\d+/, "w=900"),
  img + "&sat=-30",
  img + "&hue=10",
];

const make = (
  category: string,
  names: string[],
  basePrice: number,
  img: string,
): Product[] =>
  names.map((name, i) => {
    const price = basePrice + i * 120 + ((i * 37) % 80);
    const oldPrice = Math.round(price * (1.15 + (i % 3) * 0.05));
    return {
      slug: `${category}-${i + 1}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`.slice(0, 80),
      name,
      category,
      price,
      oldPrice,
      rating: 4 + ((i % 2) ? 0.5 : 0),
      reviews: 12 + i * 7,
      image: img,
      gallery: galleryFor(img),
      description:
        `${name} from Saha Traders — crafted for durability, designed for elegance. Sourced from premium manufacturers and finished to perfection for long-lasting beauty in your space.`,
      specs: [
        { label: "Material", value: "Premium Ceramic / Vitrified" },
        { label: "Size", value: "600 x 600 mm" },
        { label: "Finish", value: "Glossy" },
        { label: "Brand", value: "Saha Select" },
      ],
    };
  });

export const products: Product[] = [
  ...make("floor-tiles", [
    "Italian Marble Floor Tile","Wooden Texture Floor Tile","Granite Look Floor Tile","Anti-Skid Floor Tile",
    "Vitrified Floor Tile","Rustic Stone Floor Tile","Glossy White Floor Tile","Premium Black Porcelain Tile",
  ], 480, ux("photo-1615873968403-89e068629265")),
  ...make("wall-tiles", [
    "3D Textured Wall Tile","Subway White Wall Tile","Mosaic Decorative Tile","Printed Floral Wall Tile",
    "Matte Grey Wall Tile","Mirror Finish Wall Tile","Hand-Painted Tile","Geometric Pattern Wall Tile",
  ], 520, ux("photo-1600585154526-990dced4db0d")),
  ...make("kitchen-tiles", [
    "Kitchen Backsplash Mosaic","Glossy White Kitchen Tile","Stone Finish Kitchen Tile","Patterned Kitchen Wall Tile",
    "Anti-Stain Kitchen Tile","Hexagon Kitchen Tile","Terracotta Kitchen Tile","Cement Look Kitchen Tile",
  ], 560, ux("photo-1556909114-f6e7ad7d3136")),
  ...make("bathroom-tiles", [
    "Spa Blue Bathroom Tile","Marble Look Bathroom Tile","Dark Charcoal Bathroom Tile","Floral Embossed Tile",
    "Aqua Mosaic Tile","White Subway Bathroom Tile","Slate Finish Bathroom Tile","Glossy Beige Bathroom Tile",
  ], 540, ux("photo-1552321554-5fefe8c9ef14")),
  ...make("basins", [
    "Pedestal White Basin","Wall-Hung Oval Basin","Under-Counter Basin","Vessel Round Basin",
    "Rectangular Counter Basin","Semi-Recessed Basin","Slim Edge Wall Basin","Designer Art Basin",
  ], 2200, ux("photo-1604061986761-d9d0cc41b0d1")),
  ...make("commodes", [
    "One-Piece Commode","Wall-Hung Commode","Soft-Close Seat Commode","Dual Flush Commode",
    "Elongated Bowl Commode","Compact Commode","Smart Sensor Commode","Premium Western Commode",
  ], 6800, ux("photo-1631679706909-1844bbd07221")),
  ...make("taps", [
    "Single Lever Basin Tap","Pillar Cock Tap","Sensor Tap","Waterfall Tap",
    "Chrome Finish Mixer Tap","Wall-Mounted Tap","Antique Brass Tap","Concealed Tap",
  ], 1200, ux("photo-1584622650111-993a426fbf0a")),
  ...make("sinks", [
    "Single Bowl Kitchen Sink","Double Bowl Sink","Undermount Sink","Farmhouse Sink",
    "Stainless Steel Sink","Granite Composite Sink","Corner Sink","Apron Front Sink",
  ], 3200, ux("photo-1556909114-44e3e70034e2")),
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getProductsByCategory = (slug: string) => products.filter((p) => p.category === slug);
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getFeatured = () => {
  // 1 from each category = 8
  return categories.map((c) => products.find((p) => p.category === c.slug)!).filter(Boolean);
};

export const inr = (n: number) =>
  "₹" + n.toLocaleString("en-IN");