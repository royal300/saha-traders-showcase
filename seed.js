import mysql from "mysql2/promise";

const host = "127.0.0.1";
const user = "root";
const password = "mypass";
const database = "saha_marble_tiles";

const categoryMeta = [
  { slug: "floor-tiles", name: "Floor Tiles", blurb: "Durable, elegant floor tiles for every room.", image: "https://image.pollinations.ai/prompt/premium%20vitrified%20floor%20tiles%20samples%2C%20marble%20granite%20wood%20pattern%20slabs%2C%20studio%20product%20display%2C%20800x800?width=800&height=800&nologo=true&seed=81452&model=flux", banner: "https://image.pollinations.ai/prompt/modern%20elegant%20living%20room%20interior%20with%20polished%20glossy%20white%20marble%20floor%20tiles%20installed%2C%20spacious%20luxury%20home%2C%20wide%20banner%20format%2C%20photorealistic%2C%201600x600?width=1600&height=600&nologo=true&seed=875323&model=flux" },
  { slug: "wall-tiles", name: "Wall Tiles", blurb: "Statement wall tiles that elevate any interior.", image: "https://image.pollinations.ai/prompt/decorative%20wall%20tiles%20mosaic%20subway%20ceramic%20textured%20samples%2C%20studio%20product%20packshot%2C%20800x800?width=800&height=800&nologo=true&seed=732152&model=flux", banner: "https://image.pollinations.ai/prompt/modern%20luxurious%20bathroom%20interior%20with%20stylish%20designer%20ceramic%20wall%20tiles%2C%20high-end%20design%2C%20photorealistic%2C%201600x600?width=1600&height=600&nologo=true&seed=152145&model=flux" },
  { slug: "kitchen-tiles", name: "Kitchen Tiles", blurb: "Stain-resistant, beautiful kitchen tiles.", image: "https://image.pollinations.ai/prompt/modern%20kitchen%20backsplash%20tiles%2C%20glossy%20mosaic%20hexagon%20subway%20patterns%2C%20studio%20packshot%2C%20800x800?width=800&height=800&nologo=true&seed=684122&model=flux", banner: "https://image.pollinations.ai/prompt/spacious%20luxury%20kitchen%20with%20beautiful%20ceramic%20tiled%20backsplash%2C%20marble%20countertops%2C%20bright%20modern%20interior%2C%201600x600?width=1600&height=600&nologo=true&seed=754512&model=flux" },
  { slug: "bathroom-tiles", name: "Bathroom Tiles", blurb: "Spa-worthy bathroom tile collections.", image: "/assets/bathroom-tiles.jpg", banner: "https://image.pollinations.ai/prompt/luxury%20spa%20bathroom%20interior%20with%20elegant%20ceramic%20floor%20and%20wall%20tiles%20installed%2C%20high-end%20fixtures%2C%201600x600?width=1600&height=600&nologo=true&seed=845612&model=flux" },
  { slug: "basins", name: "Basins", blurb: "Designer basins in every shape and finish.", image: "https://image.pollinations.ai/prompt/collection%20of%20modern%20white%20ceramic%20bathroom%20wash%20basins%2C%20pedestal%20and%20counter%20washbasins%2C%20product%20display%2C%20800x800?width=800&height=800&nologo=true&seed=745122&model=flux", banner: "https://image.pollinations.ai/prompt/luxury%20bathroom%20vanity%20counter%20with%20premium%20white%20ceramic%20wash%20basin%2C%20elegant%20faucet%20tap%2C%20mirror%2C%20warm%20lighting%2C%201600x600?width=1600&height=600&nologo=true&seed=15245&model=flux" },
  { slug: "commodes", name: "Commodes", blurb: "Modern commodes engineered for comfort.", image: "/assets/comod.jpg", banner: "https://image.pollinations.ai/prompt/clean%20contemporary%20bathroom%20interior%20with%20a%20premium%20white%20ceramic%20toilet%20commode%20installed%2C%20minimalist%20design%2C%201600x600?width=1600&height=600&nologo=true&seed=652145&model=flux" },
  { slug: "taps", name: "Taps", blurb: "Premium taps with lasting brilliance.", image: "/assets/taps.jpg", banner: "https://image.pollinations.ai/prompt/modern%20luxury%20bathroom%20sink%20vanity%20with%20an%20elegant%20polished%20chrome%20tap%20faucet%20close-up%2C%20water%20drop%2C%20photorealistic%2C%201600x600?width=1600&height=600&nologo=true&seed=92415&model=flux" },
  { slug: "sinks", name: "Sinks", blurb: "Kitchen sinks built for everyday excellence.", image: "/assets/sink.jpg", banner: "https://image.pollinations.ai/prompt/beautiful%20modern%20kitchen%20design%20with%20stainless%20steel%20sink%2C%20designer%20faucet%20tap%2C%20clean%20marble%20countertop%2C%201600x600?width=1600&height=600&nologo=true&seed=12415&model=flux" }
];

const specsByCategory = {
  "floor-tiles": [
    { label: "Material", value: "Vitrified Porcelain" },
    { label: "Size", value: "600 × 600 mm" },
    { label: "Finish", value: "Glossy / Matte" },
    { label: "Coverage", value: "4 tiles per box" }
  ],
  "wall-tiles": [
    { label: "Material", value: "Ceramic" },
    { label: "Size", value: "300 × 600 mm" },
    { label: "Finish", value: "Glossy / Matte" },
    { label: "Use", value: "Interior walls" }
  ],
  "kitchen-tiles": [
    { label: "Material", value: "Ceramic" },
    { label: "Size", value: "300 × 600 mm" },
    { label: "Finish", value: "Glossy" },
    { label: "Feature", value: "Stain resistant" }
  ],
  "bathroom-tiles": [
    { label: "Material", value: "Ceramic" },
    { label: "Size", value: "300 × 600 mm" },
    { label: "Finish", value: "Glossy" },
    { label: "Use", value: "Wet areas" }
  ],
  basins: [
    { label: "Material", value: "Ceramic" },
    { label: "Mount", value: "Wall / Pedestal / Counter" },
    { label: "Colour", value: "White" },
    { label: "Brand", value: "Saha Select" }
  ],
  commodes: [
    { label: "Material", value: "Ceramic" },
    { label: "Type", value: "One-piece / Wall-hung" },
    { label: "Flush", value: "Dual flush" },
    { label: "Brand", value: "Saha Select" }
  ],
  taps: [
    { label: "Material", value: "Brass with chrome finish" },
    { label: "Type", value: "Basin mixer / Pillar" },
    { label: "Finish", value: "Chrome / Brass" },
    { label: "Brand", value: "Saha Select" }
  ],
  sinks: [
    { label: "Material", value: "Stainless steel / Composite" },
    { label: "Bowls", value: "Single / Double" },
    { label: "Mount", value: "Top / Undermount" },
    { label: "Brand", value: "Saha Select" }
  ]
};

const basePrices = {
  "floor-tiles": 480,
  "wall-tiles": 520,
  "kitchen-tiles": 560,
  "bathroom-tiles": 540,
  basins: 2200,
  commodes: 6800,
  taps: 1200,
  sinks: 3200
};

const productNames = {
  "floor-tiles": [
    "Italian Marble Floor Tile", "Wooden Texture Floor Tile", "Granite Look Floor Tile", "Anti-Skid Floor Tile",
    "Vitrified Floor Tile", "Rustic Stone Floor Tile", "Glossy White Floor Tile", "Premium Black Porcelain Tile"
  ],
  "wall-tiles": [
    "3D Textured Wall Tile", "Subway White Wall Tile", "Mosaic Decorative Tile", "Printed Floral Wall Tile",
    "Matte Grey Wall Tile", "Mirror Finish Wall Tile", "Hand-Painted Tile", "Geometric Pattern Wall Tile"
  ],
  "kitchen-tiles": [
    "Kitchen Backsplash Mosaic", "Glossy White Kitchen Tile", "Stone Finish Kitchen Tile", "Patterned Kitchen Wall Tile",
    "Anti-Stain Kitchen Tile", "Hexagon Kitchen Tile", "Terracotta Kitchen Tile", "Cement Look Kitchen Tile"
  ],
  "bathroom-tiles": [
    "Spa Blue Bathroom Tile", "Marble Look Bathroom Tile", "Dark Charcoal Bathroom Tile", "Floral Embossed Tile",
    "Aqua Mosaic Tile", "White Subway Bathroom Tile", "Slate Finish Bathroom Tile", "Glossy Beige Bathroom Tile"
  ],
  basins: [
    "Pedestal White Basin", "Wall-Hung Oval Basin", "Under-Counter Basin", "Vessel Round Basin",
    "Rectangular Counter Basin", "Semi-Recessed Basin", "Slim Edge Wall Basin", "Designer Art Basin"
  ],
  commodes: [
    "One-Piece Commode", "Wall-Hung Commode", "Soft-Close Seat Commode", "Dual Flush Commode",
    "Elongated Bowl Commode", "Compact Commode", "Smart Sensor Commode", "Premium Western Commode"
  ],
  taps: [
    "Single Lever Basin Tap", "Pillar Cock Tap", "Sensor Tap", "Waterfall Tap",
    "Chrome Finish Mixer Tap", "Wall-Mounted Tap", "Antique Brass Tap", "Concealed Tap"
  ],
  sinks: [
    "Single Bowl Kitchen Sink", "Double Bowl Sink", "Undermount Sink", "Farmhouse Sink",
    "Stainless Steel Sink", "Granite Composite Sink", "Corner Sink", "Apron Front Sink"
  ]
};

// Generates dynamic Pollinations AI image links to keep them fast and lightweight
function ai(prompt, w = 800, h = 800, seed = 42) {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${w}&height=${h}&nologo=true&seed=${seed}&model=flux`;
}

async function seed() {
  const conn = await mysql.createConnection({ host, user, password, database });
  console.log("Connected to MySQL on VPS for seeding...");

  try {
    // 1. Insert Categories
    console.log("Seeding Categories...");
    for (const cat of categoryMeta) {
      await conn.query(
        `INSERT INTO categories (slug, name, image, banner, blurb, is_featured) 
         VALUES (?, ?, ?, ?, ?, 1) 
         ON DUPLICATE KEY UPDATE name=VALUES(name), image=VALUES(image), banner=VALUES(banner), blurb=VALUES(blurb)`,
        [cat.slug, cat.name, cat.image, cat.banner, cat.blurb]
      );
    }

    // 2. Insert Products
    console.log("Seeding Products...");
    for (const [catSlug, names] of Object.entries(productNames)) {
      const basePrice = basePrices[catSlug] || 500;
      const specs = specsByCategory[catSlug] || [];

      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        const slug = `${catSlug}-${i + 1}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`.slice(0, 80);
        const price = basePrice + i * 120 + ((i * 37) % 80);
        const oldPrice = Math.round(price * (1.15 + (i % 3) * 0.05));
        const rating = 4.5;
        const reviews = 12 + i * 7;
        const mainImage = ai(`premium ${name} sample, professional product packshot, clean studio background`, 800, 800, 100 + i);
        
        const gallery = JSON.stringify([
          mainImage,
          ai(`macro close-up texture of ${name}`, 800, 800, 200 + i),
          ai(`luxury room showcase with ${name} installed`, 800, 800, 300 + i)
        ]);

        const details = JSON.stringify([
          "Premium Quality Certified",
          "Available in bulk orders",
          "Free delivery on orders above ₹5000",
          "Easy return within 7 days"
        ]);

        const description = `${name} from Saha Marble & Tiles — crafted for durability, designed for elegance. Sourced from premium manufacturers and finished to perfection for long-lasting beauty in your space.`;

        await conn.query(
          `INSERT INTO products (id, slug, name, category_slug, price, old_price, rating, reviews, image, gallery, description, details, specs, shipping_info, return_policy) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price), old_price=VALUES(old_price), image=VALUES(image), gallery=VALUES(gallery), specs=VALUES(specs)`,
          [
            slug, slug, name, catSlug, price, oldPrice, rating, reviews, mainImage, gallery, description, 
            details, JSON.stringify(specs), 
            "Delivered across Barasat and nearby areas within 2–4 business days. Free shipping on orders above ₹5000.",
            "7-day hassle-free return on unused products in original packaging."
          ]
        );
      }
    }

    // 3. Insert Hero Slides (Media Table)
    console.log("Seeding Hero Slider Banners...");
    const heroSlides = [
      {
        label: "Floor & Wall Tiles",
        heading: "Elegance Beneath Every Step",
        sub: "Premium floor and wall tiles for homes, kitchens, and commercial spaces",
        image: "/assets/banner-BhTJ6dWB.png",
        slug: "floor-tiles",
        display_order: 1
      },
      {
        label: "Basins & Sinks",
        heading: "Where Function Meets Beauty",
        sub: "Designer basins and sinks that transform your bathroom and kitchen",
        image: ai("designer wash basin and modern kitchen sink display, premium showroom wide banner", 1920, 1080, 501),
        slug: "basins",
        display_order: 2
      },
      {
        label: "Commodes & Taps",
        heading: "Redefine Your Bathroom Luxury",
        sub: "Sleek commodes and premium taps built for modern living",
        image: ai("minimalist contemporary toilet commode and bathroom tap faucet, luxury interior wide banner", 1920, 1080, 502),
        slug: "commodes",
        display_order: 3
      }
    ];

    await conn.query(`DELETE FROM media`); // Clear and recreate slides
    for (const slide of heroSlides) {
      await conn.query(
        `INSERT INTO media (image, heading, sub, label, slug, display_order) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [slide.image, slide.heading, slide.sub, slide.label, slide.slug, slide.display_order]
      );
    }

    // 4. Insert Default Settings (WhatsApp Number)
    console.log("Seeding Settings...");
    await conn.query(
      `INSERT INTO settings (setting_key, setting_value) 
       VALUES ('whatsapp_number', '919330833711')
       ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value)`
    );

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await conn.end();
  }
}

seed();
