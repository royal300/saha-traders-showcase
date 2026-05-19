/** Stable seed from string so the same prompt/seed combination always returns the same image. */
export function seedFrom(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h) % 999_983;
}

/** Pollinations AI product / category imagery (Flux model). */
export function ai(
  prompt: string,
  w = 800,
  h = 800,
  seed?: number,
): string {
  const s = seed ?? seedFrom(prompt);
  const q = new URLSearchParams({
    width: String(w),
    height: String(h),
    nologo: "true",
    seed: String(s),
    model: "flux",
  });
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${q}`;
}

import mainHeroBanner from "../banner.png";
import imgBathroomTiles from "../Image/category/bathroom-tiles.jpg";
import imgComodes from "../Image/category/comod.jpg";
import imgSinks from "../Image/category/sink.jpg";
import imgTaps from "../Image/category/taps.jpg";

import floor1 from "../Image/Products/floor/4-1230-230-spc-floor-tiles-for-floors-interlocking-flooring-original-imah4kygh6w2m3uz.webp";
import floor2 from "../Image/Products/floor/bathroom-floor-tiles-3.webp";
import floor3 from "../Image/Products/floor/images (12).jpg";
import floor4 from "../Image/Products/floor/orient_bell_-_super_gloss_portoro_gold_marble_1.jpg";

import wall1 from "../Image/Products/wall/50.jpg";
import wall2 from "../Image/Products/wall/51.jpg";
import wall3 from "../Image/Products/wall/52.jpg";
import wall4 from "../Image/Products/wall/53.jpg";

import kitchen1 from "../Image/Products/kitchen/1.jpg";
import kitchen2 from "../Image/Products/kitchen/2.jpg";
import kitchen3 from "../Image/Products/kitchen/3.webp";
import kitchen4 from "../Image/Products/kitchen/4.jpg";

import bathroomTile1 from "../Image/Products/bathroom/12x18-fish-page-0019-500x500.webp";
import bathroomTile2 from "../Image/Products/bathroom/250x375-designer-bathroom-wall-tiles-2219405794-2w7kxklt.avif";
import bathroomTile3 from "../Image/Products/bathroom/designer-bathroom-wall-tiles.jpg";
import bathroomTile4 from "../Image/Products/bathroom/onyx-blue-1_1_.webp";

import basin1 from "../Image/Products/basin/37-50-9-8-wash-basin-20-x-14-x-6-inches-over-counter-basin-for-original-imahah5zdn5yaduf.webp";
import basin2 from "../Image/Products/basin/71RWIrwUk8L._AC_UF1000,1000_QL80_.jpg";
import basin3 from "../Image/Products/basin/81QQL_8mmGL.webp";
import basin4 from "../Image/Products/basin/9122310SW.webp";

import commode1 from "../Image/Products/comod/01_4bfe4baf-7f1c-405d-855b-fa63731e8b01.webp";
import commode2 from "../Image/Products/comod/61TsgFj3OkL.jpg";
import commode3 from "../Image/Products/comod/68-51-4-aps-745-plantex-75-original-imahm8r2ppctze8d.webp";
import commode4 from "../Image/Products/comod/images (11).jpg";

import tap1 from "../Image/Products/tap/61gUuFAlXmL._SL1000.jpg";
import tap2 from "../Image/Products/tap/images (10).jpg";
import tap3 from "../Image/Products/tap/images (9).jpg";
import tap4 from "../Image/Products/tap/wall-mount-installation-type-for-sink-wash-basin-taps-2-in-1-enriched-0-original-imahcgmuvzqb6gws.webp";

import sink1 from "../Image/Products/sink/114b4f59-6995-4b1f-a797-bd57bd997853.webp";
import sink2 from "../Image/Products/sink/images (6).jpg";
import sink3 from "../Image/Products/sink/images (7).jpg";
import sink4 from "../Image/Products/sink/images (8).jpg";

export const categoryVisuals: Record<string, { thumb: string; banner: string }> = {
  "floor-tiles": {
    thumb: ai("premium vitrified floor tiles samples, marble granite wood pattern slabs, studio product display, 800x800", 800, 800, seedFrom("cat-thumb-floor-tiles")),
    banner: ai("modern elegant living room interior with polished glossy white marble floor tiles installed, spacious luxury home, wide banner format, photorealistic, 1600x600", 1600, 600, seedFrom("cat-banner-floor-tiles")),
  },
  "wall-tiles": {
    thumb: ai("decorative wall tiles mosaic subway ceramic textured samples, studio product packshot, 800x800", 800, 800, seedFrom("cat-thumb-wall-tiles")),
    banner: ai("modern luxurious bathroom interior with stylish designer ceramic wall tiles, high-end design, photorealistic, 1600x600", 1600, 600, seedFrom("cat-banner-wall-tiles")),
  },
  "kitchen-tiles": {
    thumb: ai("modern kitchen backsplash tiles, glossy mosaic hexagon subway patterns, studio packshot, 800x800", 800, 800, seedFrom("cat-thumb-kitchen-tiles")),
    banner: ai("spacious luxury kitchen with beautiful ceramic tiled backsplash, marble countertops, bright modern interior, 1600x600", 1600, 600, seedFrom("cat-banner-kitchen-tiles")),
  },
  "bathroom-tiles": {
    thumb: imgBathroomTiles,
    banner: ai("luxury spa bathroom interior with elegant ceramic floor and wall tiles installed, high-end fixtures, 1600x600", 1600, 600, seedFrom("cat-banner-bathroom-tiles")),
  },
  basins: {
    thumb: ai("collection of modern white ceramic bathroom wash basins, pedestal and counter washbasins, product display, 800x800", 800, 800, seedFrom("cat-thumb-basins")),
    banner: ai("luxury bathroom vanity counter with premium white ceramic wash basin, elegant faucet tap, mirror, warm lighting, 1600x600", 1600, 600, seedFrom("cat-banner-basins")),
  },
  commodes: {
    thumb: imgComodes,
    banner: ai("clean contemporary bathroom interior with a premium white ceramic toilet commode installed, minimalist design, 1600x600", 1600, 600, seedFrom("cat-banner-commodes")),
  },
  taps: {
    thumb: imgTaps,
    banner: ai("modern luxury bathroom sink vanity with an elegant polished chrome tap faucet close-up, water drop, photorealistic, 1600x600", 1600, 600, seedFrom("cat-banner-taps")),
  },
  sinks: {
    thumb: imgSinks,
    banner: ai("beautiful modern kitchen design with stainless steel sink, designer faucet tap, clean marble countertop, 1600x600", 1600, 600, seedFrom("cat-banner-sinks")),
  },
};

const productNames: Record<string, string[]> = {
  "floor-tiles": [
    "Italian Marble Floor Tile",
    "Wooden Texture Floor Tile",
    "Granite Look Floor Tile",
    "Anti-Skid Floor Tile",
    "Vitrified Floor Tile",
    "Rustic Stone Floor Tile",
    "Glossy White Floor Tile",
    "Premium Black Porcelain Tile",
  ],
  "wall-tiles": [
    "3D Textured Wall Tile",
    "Subway White Wall Tile",
    "Mosaic Decorative Tile",
    "Printed Floral Wall Tile",
    "Matte Grey Wall Tile",
    "Mirror Finish Wall Tile",
    "Hand-Painted Tile",
    "Geometric Pattern Wall Tile",
  ],
  "kitchen-tiles": [
    "Kitchen Backsplash Mosaic",
    "Glossy White Kitchen Tile",
    "Stone Finish Kitchen Tile",
    "Patterned Kitchen Wall Tile",
    "Anti-Stain Kitchen Tile",
    "Hexagon Kitchen Tile",
    "Terracotta Kitchen Tile",
    "Cement Look Kitchen Tile",
  ],
  "bathroom-tiles": [
    "Spa Blue Bathroom Tile",
    "Marble Look Bathroom Tile",
    "Dark Charcoal Bathroom Tile",
    "Floral Embossed Tile",
    "Aqua Mosaic Tile",
    "White Subway Bathroom Tile",
    "Slate Finish Bathroom Tile",
    "Glossy Beige Bathroom Tile",
  ],
  basins: [
    "Pedestal White Basin",
    "Wall-Hung Oval Basin",
    "Under-Counter Basin",
    "Vessel Round Basin",
    "Rectangular Counter Basin",
    "Semi-Recessed Basin",
    "Slim Edge Wall Basin",
    "Designer Art Basin",
  ],
  commodes: [
    "One-Piece Commode",
    "Wall-Hung Commode",
    "Soft-Close Seat Commode",
    "Dual Flush Commode",
    "Elongated Bowl Commode",
    "Compact Commode",
    "Smart Sensor Commode",
    "Premium Western Commode",
  ],
  taps: [
    "Single Lever Basin Tap",
    "Pillar Cock Tap",
    "Sensor Tap",
    "Waterfall Tap",
    "Chrome Finish Mixer Tap",
    "Wall-Mounted Tap",
    "Antique Brass Tap",
    "Concealed Tap",
  ],
  sinks: [
    "Single Bowl Kitchen Sink",
    "Double Bowl Sink",
    "Undermount Sink",
    "Farmhouse Sink",
    "Stainless Steel Sink",
    "Granite Composite Sink",
    "Corner Sink",
    "Apron Front Sink",
  ],
};

function getDynamicPrompts(category: string, productName: string): [string, string, string, string] {
  const item = productName.trim();
  
  if (category === "floor-tiles") {
    return [
      `premium ${item} sample, vitrified floor tile glossy 600x600mm, professional studio packshot, clean solid background, photorealistic`,
      `macro close-up shot of ${item} texture, high-quality porcelain tile surface detail, elegant finish`,
      `luxurious spacious living room interior with polished ${item} floor tiles installed, modern furniture, bright photorealistic photography`,
      `stack of ${item} samples on display in a luxury tile showroom retail store, professional lighting`
    ];
  }
  if (category === "wall-tiles") {
    return [
      `designer ${item} sample, ceramic wall tile glossy 300x600mm, professional studio packshot, clean solid background, photorealistic`,
      `macro close-up shot of ${item} texture, 3d relief ceramic detail, high-quality surface finish`,
      `elegant luxury bathroom feature wall showing ${item} installed, modern design, professional interior photography`,
      `panel of ${item} samples on display in a modern building materials showroom, professional lighting`
    ];
  }
  if (category === "kitchen-tiles") {
    return [
      `modern ${item} sample, kitchen backsplash tile glossy, professional studio packshot, clean background, photorealistic`,
      `macro close-up shot of ${item} mosaic texture, clean ceramic glaze detail, kitchen design sample`,
      `beautiful modern kitchen interior showing ${item} backsplash tiles installed behind stove, marble countertop, bright lighting`,
      `display board of ${item} backsplash tiles in a home renovation showroom, professional lighting`
    ];
  }
  if (category === "bathroom-tiles") {
    return [
      `spa style ${item} sample, premium bathroom wall and floor tile, professional studio packshot, clean background`,
      `macro close-up of ${item} tile texture, polished marble ceramic finish, elegant bathroom materials`,
      `luxury master bathroom shower wall showing ${item} tiles installed, glass door, modern fixtures, photorealistic`,
      `showroom sample panel displaying ${item} tiles collection, premium tiles retail setting`
    ];
  }
  if (category === "basins") {
    return [
      `luxury white ceramic ${item}, modern bathroom wash basin, professional studio packshot, clean neutral background, photorealistic`,
      `close-up detailed shot of ${item} fine ceramic glaze, curves, and overflow drain hole, studio lighting`,
      `premium bathroom vanity counter showing ${item} washbasin installed, designer chrome tap faucet, mirror, warm lighting`,
      `collection of ${item} models displayed on shelves in a luxury sanitaryware showroom, retail lighting`
    ];
  }
  if (category === "commodes") {
    return [
      `premium white ceramic ${item}, modern one-piece toilet commode, soft-close seat lid, professional studio packshot, clean background`,
      `close-up detailed shot of ${item} dual flush button and seat hinge, clean sanitaryware design`,
      `minimalist contemporary bathroom interior showing ${item} toilet commode installed against clean wall, neat and tidy`,
      `display of premium ${item} models in a high-end bathroom fittings showroom`
    ];
  }
  if (category === "taps") {
    return [
      `luxury polished ${item} faucet, bathroom tap mixer, professional studio packshot, clean reflective background, photorealistic`,
      `extreme close-up macro of ${item} metallic finish, chrome reflection, handle detail, studio lighting`,
      `elegant bathroom sink basin with ${item} installed, running water droplet, modern bathroom design`,
      `row of premium ${item} models displayed on a showroom sample wall, professional retail display`
    ];
  }
  if (category === "sinks") {
    return [
      `premium ${item}, high-quality kitchen sink single double bowl, professional studio packshot, clean background, photorealistic`,
      `close-up detail of ${item} satin finish, drainer board, stainless steel composite texture`,
      `modern kitchen countertop with ${item} installed, designer gooseneck tap faucet, clean neat kitchen design`,
      `selection of premium ${item} models in a kitchen equipment showroom display`
    ];
  }

  return [
    `premium ${item} for home improvement, professional studio product shot, clean background`,
    `close-up texture and detail of ${item}`,
    `luxury interior design showing ${item} installed, beautiful environment`,
    `showroom display of ${item} products`
  ];
}

function buildProductImages(category: string, productName: string) {
  const [p1, p2, p3, p4] = getDynamicPrompts(category, productName);
  const main = ai(p1, 800, 800, seedFrom(`${category}-${productName}-main`));
  const gallery = [
    main,
    ai(p2, 800, 800, seedFrom(`${category}-${productName}-detail`)),
    ai(p3, 800, 800, seedFrom(`${category}-${productName}-room`)),
    ai(p4, 800, 800, seedFrom(`${category}-${productName}-showroom`))
  ];
  return { image: main, gallery };
}

function buildCatalog() {
  const catalog: Record<string, { name: string; image: string; gallery: string[] }[]> = {};
  for (const [category, names] of Object.entries(productNames)) {
    catalog[category] = names.map((name) => ({
      name,
      ...buildProductImages(category, name),
    }));
  }
  return catalog;
}

const generatedCatalog = buildCatalog();

generatedCatalog["floor-tiles"] = [
  { name: "Premium Floor Tile 1", image: floor1, gallery: [floor1, floor2, floor3, floor4] },
  { name: "Premium Floor Tile 2", image: floor2, gallery: [floor2, floor3, floor4, floor1] },
  { name: "Premium Floor Tile 3", image: floor3, gallery: [floor3, floor4, floor1, floor2] },
  { name: "Premium Floor Tile 4", image: floor4, gallery: [floor4, floor1, floor2, floor3] },
];

generatedCatalog["wall-tiles"] = [
  { name: "Designer Wall Tile 1", image: wall1, gallery: [wall1, wall2, wall3, wall4] },
  { name: "Designer Wall Tile 2", image: wall2, gallery: [wall2, wall3, wall4, wall1] },
  { name: "Designer Wall Tile 3", image: wall3, gallery: [wall3, wall4, wall1, wall2] },
  { name: "Designer Wall Tile 4", image: wall4, gallery: [wall4, wall1, wall2, wall3] },
];

generatedCatalog["kitchen-tiles"] = [
  { name: "Kitchen Backsplash 1", image: kitchen1, gallery: [kitchen1, kitchen2, kitchen3, kitchen4] },
  { name: "Kitchen Backsplash 2", image: kitchen2, gallery: [kitchen2, kitchen3, kitchen4, kitchen1] },
  { name: "Kitchen Backsplash 3", image: kitchen3, gallery: [kitchen3, kitchen4, kitchen1, kitchen2] },
  { name: "Kitchen Backsplash 4", image: kitchen4, gallery: [kitchen4, kitchen1, kitchen2, kitchen3] },
];

generatedCatalog["bathroom-tiles"] = [
  { name: "Designer Bathroom Tile 1", image: bathroomTile1, gallery: [bathroomTile1, bathroomTile2, bathroomTile3, bathroomTile4] },
  { name: "Designer Bathroom Tile 2", image: bathroomTile2, gallery: [bathroomTile2, bathroomTile3, bathroomTile4, bathroomTile1] },
  { name: "Designer Bathroom Tile 3", image: bathroomTile3, gallery: [bathroomTile3, bathroomTile4, bathroomTile1, bathroomTile2] },
  { name: "Designer Bathroom Tile 4", image: bathroomTile4, gallery: [bathroomTile4, bathroomTile1, bathroomTile2, bathroomTile3] },
];

generatedCatalog["basins"] = [
  { name: "Premium Wash Basin 1", image: basin1, gallery: [basin1, basin2, basin3, basin4] },
  { name: "Premium Wash Basin 2", image: basin2, gallery: [basin2, basin3, basin4, basin1] },
  { name: "Premium Wash Basin 3", image: basin3, gallery: [basin3, basin4, basin1, basin2] },
  { name: "Premium Wash Basin 4", image: basin4, gallery: [basin4, basin1, basin2, basin3] },
];

generatedCatalog["commodes"] = [
  { name: "Luxury Commode 1", image: commode1, gallery: [commode1, commode2, commode3, commode4] },
  { name: "Luxury Commode 2", image: commode2, gallery: [commode2, commode3, commode4, commode1] },
  { name: "Luxury Commode 3", image: commode3, gallery: [commode3, commode4, commode1, commode2] },
  { name: "Luxury Commode 4", image: commode4, gallery: [commode4, commode1, commode2, commode3] },
];

generatedCatalog["taps"] = [
  { name: "Modern Faucet Tap 1", image: tap1, gallery: [tap1, tap2, tap3, tap4] },
  { name: "Modern Faucet Tap 2", image: tap2, gallery: [tap2, tap3, tap4, tap1] },
  { name: "Modern Faucet Tap 3", image: tap3, gallery: [tap3, tap4, tap1, tap2] },
  { name: "Modern Faucet Tap 4", image: tap4, gallery: [tap4, tap1, tap2, tap3] },
];

generatedCatalog["sinks"] = [
  { name: "Stainless Steel Sink 1", image: sink1, gallery: [sink1, sink2, sink3, sink4] },
  { name: "Stainless Steel Sink 2", image: sink2, gallery: [sink2, sink3, sink4, sink1] },
  { name: "Stainless Steel Sink 3", image: sink3, gallery: [sink3, sink4, sink1, sink2] },
  { name: "Stainless Steel Sink 4", image: sink4, gallery: [sink4, sink1, sink2, sink3] },
];

export const catalogSeeds = generatedCatalog;

export const heroSlides = [
  {
    slug: "floor-tiles",
    label: "Floor & Wall Tiles",
    heading: "Elegance Beneath Every Step",
    sub: "Premium floor and wall tiles for homes, kitchens, and commercial spaces",
    img: mainHeroBanner,
  },
  {
    slug: "basins",
    label: "Basins & Sinks",
    heading: "Where Function Meets Beauty",
    sub: "Designer basins and sinks that transform your bathroom and kitchen",
    img: ai("designer luxury bathroom wash basin and modern kitchen sink display, premium fixtures showroom, wide banner, warm lighting, 1920x1080", 1920, 1080, seedFrom("hero-basins-sinks")),
  },
  {
    slug: "commodes",
    label: "Commodes & Taps",
    heading: "Redefine Your Bathroom Luxury",
    sub: "Sleek commodes and premium taps built for modern living",
    img: ai("minimalist contemporary bathroom toilet commode and polished chrome bathroom tap faucet close-up, luxury interior wide banner, photorealistic, 1920x1080", 1920, 1080, seedFrom("hero-commodes-taps")),
  },
] as const;

export const showroomBanner = ai("beautiful modern tile and bathroom fittings showroom interior display shelves products warm lighting photorealistic wide, 1920x1080", 1920, 1080, seedFrom("showroom-banner"));
