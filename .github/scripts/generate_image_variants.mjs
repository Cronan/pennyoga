#!/usr/bin/env node
/**
 * Generate AVIF + WebP siblings for every JPG/PNG in images/ that lacks
 * an up-to-date variant. Runs in CI; no install required by editors.
 *
 * Skips:
 *   - SVGs and existing AVIF/WebP files
 *   - logos and favicons (handled separately)
 *
 * Quality targets chosen for photographic content at modest sizes.
 */
import { readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const IMG_DIR = path.resolve('images');
const SKIP = new Set(['favicon.svg', 'pablo-logo.jpg', 'bwy-logo.png', 'placeholder.svg']);

const AVIF_OPTS = { quality: 55, effort: 6 };
const WEBP_OPTS = { quality: 78, effort: 5 };

async function isOlderOrMissing(target, sourceMtime) {
  if (!existsSync(target)) return true;
  const t = await stat(target);
  return t.mtimeMs < sourceMtime;
}

async function main() {
  const entries = await readdir(IMG_DIR);
  const sources = entries.filter(
    (f) => /\.(jpe?g|png)$/i.test(f) && !SKIP.has(f),
  );

  let changes = 0;
  for (const file of sources) {
    const src = path.join(IMG_DIR, file);
    const base = file.replace(/\.[^.]+$/, '');
    const srcStat = await stat(src);

    const avifPath = path.join(IMG_DIR, `${base}.avif`);
    const webpPath = path.join(IMG_DIR, `${base}.webp`);

    if (await isOlderOrMissing(avifPath, srcStat.mtimeMs)) {
      await sharp(src).avif(AVIF_OPTS).toFile(avifPath);
      console.log(`avif: ${path.relative('.', avifPath)}`);
      changes++;
    }
    if (await isOlderOrMissing(webpPath, srcStat.mtimeMs)) {
      await sharp(src).webp(WEBP_OPTS).toFile(webpPath);
      console.log(`webp: ${path.relative('.', webpPath)}`);
      changes++;
    }
  }

  if (changes === 0) console.log('image variants up to date');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
