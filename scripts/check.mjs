import { access, readFile, readdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const requiredFiles = [
  'README.md',
  'LICENSE',
  'CONTRIBUTING.md',
  'CODE_OF_CONDUCT.md',
  'SECURITY.md',
  'CHANGELOG.md',
  'dist/liteerp.css',
  'dist/liteerp.js',
  'examples/dashboard.html',
  'docs/architecture.md',
  'docs/integrations.md'
];

const errors = [];

for (const file of requiredFiles) {
  try {
    await access(resolve(projectRoot, file), constants.R_OK);
  } catch {
    errors.push(`Missing required file: ${file}`);
  }
}

const html = await readFile(resolve(projectRoot, 'examples/dashboard.html'), 'utf8');
const css = await readFile(resolve(projectRoot, 'dist/liteerp.css'), 'utf8');
const js = await readFile(resolve(projectRoot, 'dist/liteerp.js'), 'utf8');

for (const asset of ['../dist/liteerp.css', '../dist/liteerp.js']) {
  if (!html.includes(asset)) errors.push(`Dashboard does not reference ${asset}`);
}

if (!html.includes('data-liteerp-app')) errors.push('Dashboard is missing the application hook.');
if (!css.includes('--lerp-brand-600')) errors.push('CSS is missing public theme tokens.');
if (!js.includes('liteerp:')) errors.push('JavaScript is missing namespaced events.');
if (!html.includes('lerp-theme-icon-moon') || !html.includes('lerp-theme-icon-sun')) {
  errors.push('Dashboard must include both theme-state icons.');
}

const generatedDirectory = resolve(projectRoot, 'examples/pages');
const findHtml = async directory => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => entry.isDirectory() ? findHtml(resolve(directory, entry.name)) : [resolve(directory, entry.name)]));
  return nested.flat().filter(file => file.endsWith('.html'));
};
const generatedPages = await findHtml(generatedDirectory);
if (generatedPages.length < 90) errors.push(`Expected at least 90 ERP template pages, found ${generatedPages.length}.`);

const exampleFiles = [resolve(projectRoot, 'examples/dashboard.html'), ...generatedPages];
for (const exampleFile of exampleFiles) {
  const exampleHtml = await readFile(exampleFile, 'utf8');
  const localLinks = [...exampleHtml.matchAll(/href="([^"]+)"/g)].map(match => match[1]).filter(href => !href.startsWith('#') && !href.includes('://') && !href.startsWith('mailto:'));
  for (const href of localLinks) {
    const cleanHref = href.split(/[?#]/)[0];
    try {
      await access(resolve(dirname(exampleFile), cleanHref), constants.R_OK);
    } catch {
      errors.push(`Broken local link in ${exampleFile}: ${href}`);
    }
  }
}

const employeeForm = await readFile(resolve(generatedDirectory, 'hr/employee-new.html'), 'utf8');
for (const forbiddenField of ['Payment terms', 'Credit limit', 'Customer account']) {
  if (employeeForm.includes(forbiddenField)) errors.push(`Employee form contains unrelated field: ${forbiddenField}`);
}

const componentsPage = await readFile(resolve(generatedDirectory, 'workspace/components.html'), 'utf8');
if (!componentsPage.includes('type="date"')) errors.push('Components page is missing a date example.');
if (!componentsPage.includes('<select')) errors.push('Components page is missing a searchable select example.');
for (const componentHook of ['lerp-combobox', 'lerp-calendar']) {
  if (!js.includes(componentHook)) errors.push(`JavaScript is missing the ${componentHook} component.`);
  if (!css.includes(componentHook)) errors.push(`CSS is missing the ${componentHook} component.`);
}
for (const requiredField of ['Job title', 'Department', 'Employment type', 'Start date', 'Base salary', 'Emergency contact']) {
  if (!employeeForm.includes(requiredField)) errors.push(`Employee form is missing employment field: ${requiredField}`);
}

const domainForms = [
  ['finance/general-ledger-new.html', ['Journal type','Account','Debit','Credit','Cost center'], ['Shipping address','Payment terms']],
  ['inventory/transfers-new.html', ['From warehouse','To warehouse','Expected receipt','Shipping method'], ['Tax treatment','Credit limit']],
  ['purchasing/goods-receipts-new.html', ['Purchase order','Receiving warehouse','Quantity received','Inspection result'], ['Customer account']],
  ['inventory/items-new.html', ['SKU','Unit of measure','Reorder point','Lot tracking'], ['Payment terms']]
];
for (const [formPath, required, forbidden] of domainForms) {
  const formHtml = await readFile(resolve(generatedDirectory, formPath), 'utf8');
  for (const label of required) if (!formHtml.includes(label)) errors.push(`${formPath} is missing domain field: ${label}`);
  for (const label of forbidden) if (formHtml.includes(label)) errors.push(`${formPath} contains unrelated field: ${label}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`LiteERP checks passed (${requiredFiles.length} required files).`);
}
