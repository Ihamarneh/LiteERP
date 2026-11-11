import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
await import('./generate-pages.mjs');
await import('./generate-complete.mjs');
await import('./organize-pages.mjs');
const files = [
  ['src/css/liteerp.css', 'dist/liteerp.css'],
  ['src/js/liteerp.js', 'dist/liteerp.js']
];

await mkdir(resolve(projectRoot, 'dist'), { recursive: true });

for (const [source, destination] of files) {
  const sourcePath = resolve(projectRoot, source);
  const destinationPath = resolve(projectRoot, destination);
  await copyFile(sourcePath, destinationPath);

  const output = await readFile(destinationPath, 'utf8');
  await writeFile(destinationPath, output.replaceAll('\r\n', '\n'));
  console.log(`built ${destination}`);
}

console.log('LiteERP distribution is ready.');
