import { lstat, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { LayoutResponse, LayoutIndex } from '../src/lib/layout.ts';

const ROOT = join(fileURLToPath(import.meta.url), '../..');
const LAYOUTS = join(ROOT, 'public/layouts');

const IGNORED = ['layout_schema.json', 'index.json'];

async function walk(dir = '/'): Promise<LayoutIndex[]> {
  const entries = await readdir(join(LAYOUTS, dir));

  const index: LayoutIndex[] = [];

  for (const entry of entries) {
    if (IGNORED.includes(entry)) continue;

    const entryPath = join(dir, entry);
    const absoluteEntryPath = join(LAYOUTS, entryPath);
    const stats = await lstat(absoluteEntryPath);

    if (stats.isDirectory()) {
      const subIndex = await walk(entryPath);
      index.push(...subIndex);
    } else {
      const content = await readFile(absoluteEntryPath, 'utf-8');
      const layout: LayoutResponse = JSON.parse(content);

      index.push({
        name: layout.name,
        path: entryPath.replaceAll('\\', '/').replace('/', ''),
      });
    }
  }

  return index;
}

async function main() {
  const index = await walk();

  const content = JSON.stringify(index, null, 2);
  await writeFile(join(LAYOUTS, 'index.json'), `${content}\n`);
}

main();
