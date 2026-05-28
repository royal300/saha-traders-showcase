/**
 * compress_images.mjs
 * Compresses all static source images to WebP for fast loading.
 * Run once locally: node compress_images.mjs
 */
import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join, extname, basename, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Images to compress and their max widths
const targets = [
  // Hero banner - biggest culprit (2.6MB PNG → target <150KB WebP)
  { src: "src/banner.png",   dest: "src/banner.webp",   width: 1280, quality: 82 },
  // About page banner
  { src: "src/about.png",    dest: "src/about.webp",    width: 1280, quality: 80 },
];

// Also process all images in src/Image directory
async function findImages(dir) {
  const results = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...await findImages(full));
    } else {
      const ext = extname(entry.name).toLowerCase();
      if ([".jpg", ".jpeg", ".png"].includes(ext)) {
        results.push(full);
      }
    }
  }
  return results;
}

async function compress(src, dest, width, quality = 80) {
  const srcPath = join(__dirname, src);
  const destPath = join(__dirname, dest);
  try {
    const before = (await stat(srcPath)).size;
    await sharp(srcPath)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 4 })
      .toFile(destPath);
    const after = (await stat(destPath)).size;
    const saved = ((1 - after / before) * 100).toFixed(1);
    console.log(`✅ ${src} → ${dest}  ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB  (saved ${saved}%)`);
  } catch (e) {
    console.error(`❌ Failed: ${src} →`, e.message);
  }
}

async function main() {
  console.log("🗜️  Compressing static images...\n");

  // Compress explicitly listed targets
  for (const t of targets) {
    await compress(t.src, t.dest, t.width, t.quality);
  }

  // Compress all JPGs in src/Image that are over 80KB
  const imageFiles = await findImages(join(__dirname, "src/Image"));
  for (const file of imageFiles) {
    const s = await stat(file);
    if (s.size < 80 * 1024) {
      console.log(`⏭️  Skipped (small): ${file.replace(__dirname + "/", "")}`);
      continue;
    }
    const rel = file.replace(__dirname + "/", "");
    const destRel = rel.replace(/\.(jpe?g|png)$/i, ".webp");
    // Skip if webp already exists
    try {
      await stat(join(__dirname, destRel));
      console.log(`⏭️  Already exists: ${destRel}`);
      continue;
    } catch {}
    await compress(rel, destRel, 900, 80);
  }

  console.log("\n🎉 Done! Update image imports in images.ts to use .webp versions.");
}

main().catch(console.error);
