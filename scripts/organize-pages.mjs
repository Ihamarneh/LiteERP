import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pagesDir = resolve(root, 'examples/pages');
const filenames = (await readdir(pagesDir)).filter(file => file.endsWith('.html'));

const startsWithAny = (name, prefixes) => prefixes.some(prefix => name === prefix || name.startsWith(`${prefix}-`));
const categoryFor = filename => {
  const name = filename.replace(/\.html$/, '');
  if (startsWithAny(name, ['customers','quotations','sales-orders','invoices'])) return 'sales';
  if (startsWithAny(name, ['vendors','purchase-orders','goods-receipts'])) return 'purchasing';
  if (startsWithAny(name, ['items','stock-levels','transfers'])) return 'inventory';
  if (startsWithAny(name, ['general-ledger','receivables','financial-reports','profit-loss','balance-sheet','cash-flow','trial-balance','aging-reports','budget-variance','report-builder'])) return 'finance';
  if (startsWithAny(name, ['human-resources','employee','employees','attendance','leave','payroll','recruitment','performance'])) return 'hr';
  if (startsWithAny(name, ['administration','users','roles-permissions','companies-branches','approval-workflows','taxes-currencies','audit-log','document-import'])) return 'administration';
  if (startsWithAny(name, ['login','forgot-password','404'])) return 'auth';
  return 'workspace';
};

const destinations = new Map(filenames.map(filename => [filename, `${categoryFor(filename)}/${filename}`]));
const sourceFiles = await Promise.all(filenames.map(async filename => [filename, await readFile(resolve(pagesDir, filename), 'utf8')]));

const relativeLink = (fromDestination, toDestination) => relative(dirname(fromDestination), toDestination).replaceAll('\\', '/');
const rewriteKnownTargets = (html, sourceDestination, attribute) => html.replace(new RegExp(`${attribute}="([^"]+)"`, 'g'), (match, href) => {
  const targetName = href.split('/').at(-1)?.split(/[?#]/)[0];
  if (!targetName || !destinations.has(targetName)) return match;
  return `${attribute}="${relativeLink(sourceDestination, destinations.get(targetName))}"`;
});

await rm(pagesDir, { recursive: true, force: true });
for (const [filename, source] of sourceFiles) {
  const destination = destinations.get(filename);
  let html = source
    .replaceAll('../../dist/', '../../../dist/')
    .replaceAll('href="../dashboard.html"', 'href="../../dashboard.html"');
  html = rewriteKnownTargets(html, destination, 'href');
  html = rewriteKnownTargets(html, destination, 'action');
  const destinationPath = resolve(pagesDir, destination);
  await mkdir(dirname(destinationPath), { recursive: true });
  await writeFile(destinationPath, html);
}

const dashboardPath = resolve(root, 'examples/dashboard.html');
let dashboard = await readFile(dashboardPath, 'utf8');
dashboard = dashboard.replace(/(href|action)="pages\/([^"/]+\.html)"/g, (match, attribute, filename) => {
  const destination = destinations.get(filename);
  return destination ? `${attribute}="pages/${destination}"` : match;
});
await writeFile(dashboardPath, dashboard);

console.log(`organized ${filenames.length} pages into 8 module folders`);
