import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

const root = path.resolve(process.cwd(), 'public/images');
const exts = new Set(['.png', '.jpg', '.jpeg', '.JPG', '.JPEG', '.PNG']);

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function convertOne(file) {
  const ext = path.extname(file);
  if (!exts.has(ext)) return;
  const base = file.slice(0, -ext.length);
  const webp = base + '.webp';
  const avif = base + '.avif';

  const input = sharp(file);
  const meta = await input.metadata();
  const width = meta.width;

  const pipeline = sharp(file).withMetadata();

  if (width && width > 1600) {
    pipeline.resize({ width: 1600 });
  }

  await Promise.all([
    fs.access(webp).catch(async () => {
      await pipeline.clone().webp({ quality: 82 }).toFile(webp);
    }),
    fs.access(avif).catch(async () => {
      await pipeline.clone().avif({ quality: 55 }).toFile(avif);
    }),
  ]);

  return { file, webp, avif };
}

(async () => {
  console.log('Converting images in', root);
  for await (const f of walk(root)) {
    try {
      const res = await convertOne(f);
      if (res) console.log('Converted:', path.basename(f));
    } catch (e) {
      console.error('Failed:', f, e.message);
    }
  }
})();
