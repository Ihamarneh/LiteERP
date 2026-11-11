import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = resolve(root, 'examples/pages');
await rm(outputDirectory, { recursive: true, force: true });

const pages = {
  customers: {
    section: 'Sales & CRM', title: 'Customers', description: 'Manage customer accounts, credit limits, and activity.', action: 'New customer',
    summary: [['Total customers', '1,248'], ['Active', '1,186'], ['On credit hold', '14'], ['Outstanding', '$61,480']],
    columns: ['Customer', 'Account', 'Location', 'Status', 'Balance'],
    rows: [['Atlas Retail Group', 'CUS-00184', 'Chicago, US', 'Active', '$18,420.00'], ['Meridian Foods', 'CUS-00183', 'Austin, US', 'Active', '$12,880.50'], ['Beacon Hospitality', 'CUS-00179', 'Boston, US', 'Credit hold', '$9,740.00'], ['Summit Office Co.', 'CUS-00172', 'Denver, US', 'Active', '$7,215.75'], ['Coastal Markets', 'CUS-00168', 'Miami, US', 'Inactive', '$0.00']]
  },
  quotations: {
    section: 'Sales & CRM', title: 'Quotations', description: 'Prepare, send, and track customer quotations.', action: 'New quotation',
    summary: [['Open quotes', '42'], ['Draft', '11'], ['Accepted this month', '28'], ['Pipeline value', '$184,900']],
    columns: ['Quotation', 'Customer', 'Valid until', 'Status', 'Total'],
    rows: [['QT-2026-0418', 'Atlas Retail Group', 'Nov 25, 2026', 'Sent', '$24,850.00'], ['QT-2026-0417', 'Coastal Markets', 'Nov 23, 2026', 'Draft', '$8,430.00'], ['QT-2026-0416', 'Meridian Foods', 'Nov 20, 2026', 'Accepted', '$16,920.00'], ['QT-2026-0415', 'Summit Office Co.', 'Nov 18, 2026', 'Expired', '$5,780.00']]
  },
  'sales-orders': {
    section: 'Sales & CRM', title: 'Sales orders', description: 'Monitor order fulfillment from confirmation to delivery.', action: 'New sales order',
    summary: [['Open orders', '76'], ['Ready to ship', '18'], ['Partially fulfilled', '9'], ['Order value', '$267,420']],
    columns: ['Order', 'Customer', 'Requested date', 'Status', 'Total'],
    rows: [['SO-2026-0834', 'Meridian Foods', 'Nov 14, 2026', 'Ready', '$18,240.00'], ['SO-2026-0833', 'Atlas Retail Group', 'Nov 15, 2026', 'Confirmed', '$12,480.00'], ['SO-2026-0832', 'Beacon Hospitality', 'Nov 13, 2026', 'Partial', '$9,720.00'], ['SO-2026-0831', 'Coastal Markets', 'Nov 19, 2026', 'Draft', '$6,315.00']]
  },
  invoices: {
    section: 'Sales & CRM', title: 'Invoices', description: 'Create invoices and track customer collections.', action: 'New invoice',
    summary: [['This month', '$284,650'], ['Paid', '$223,170'], ['Outstanding', '$61,480'], ['Overdue', '$14,820']],
    columns: ['Invoice', 'Customer', 'Due date', 'Status', 'Amount'],
    rows: [['INV-2026-1084', 'Atlas Retail Group', 'Nov 24, 2026', 'Pending', '$12,480.00'], ['INV-2026-1083', 'Meridian Foods', 'Nov 10, 2026', 'Paid', '$8,920.50'], ['INV-2026-1082', 'Beacon Hospitality', 'Nov 8, 2026', 'Overdue', '$5,740.00'], ['INV-2026-1081', 'Summit Office Co.', 'Nov 22, 2026', 'Pending', '$3,215.75']]
  },
  vendors: {
    section: 'Purchasing', title: 'Vendors', description: 'Maintain supplier terms, contacts, and purchasing history.', action: 'New vendor',
    summary: [['Total vendors', '386'], ['Active', '342'], ['Preferred', '28'], ['Payables', '$48,760']],
    columns: ['Vendor', 'Account', 'Category', 'Status', 'Payable'],
    rows: [['Apex Industrial Supply', 'VEN-00321', 'Materials', 'Preferred', '$14,280.00'], ['Clearwater Logistics', 'VEN-00316', 'Freight', 'Active', '$8,920.00'], ['Prime Office Systems', 'VEN-00298', 'Equipment', 'Active', '$6,440.50'], ['Vertex Components', 'VEN-00284', 'Components', 'On review', '$4,720.00']]
  },
  'purchase-orders': {
    section: 'Purchasing', title: 'Purchase orders', description: 'Control purchasing commitments and vendor orders.', action: 'New purchase order',
    summary: [['Open orders', '58'], ['Awaiting approval', '4'], ['Late delivery', '6'], ['Committed', '$138,540']],
    columns: ['Purchase order', 'Vendor', 'Expected', 'Status', 'Total'],
    rows: [['PO-2026-0624', 'Apex Industrial Supply', 'Nov 16, 2026', 'Approved', '$18,420.00'], ['PO-2026-0623', 'Vertex Components', 'Nov 18, 2026', 'Pending', '$12,870.00'], ['PO-2026-0622', 'Clearwater Logistics', 'Nov 12, 2026', 'Received', '$7,640.00'], ['PO-2026-0621', 'Prime Office Systems', 'Nov 20, 2026', 'Draft', '$4,880.00']]
  },
  'goods-receipts': {
    section: 'Purchasing', title: 'Goods receipts', description: 'Record delivered quantities and inspection outcomes.', action: 'Receive goods',
    summary: [['Received today', '14'], ['Pending inspection', '7'], ['Discrepancies', '3'], ['Month to date', '186']],
    columns: ['Receipt', 'Purchase order', 'Vendor', 'Status', 'Received'],
    rows: [['GR-2026-0294', 'PO-2026-0618', 'Apex Industrial Supply', 'Inspected', 'Nov 11, 2026'], ['GR-2026-0293', 'PO-2026-0615', 'Vertex Components', 'Pending', 'Nov 11, 2026'], ['GR-2026-0292', 'PO-2026-0612', 'Prime Office Systems', 'Discrepancy', 'Nov 10, 2026'], ['GR-2026-0291', 'PO-2026-0609', 'Clearwater Logistics', 'Posted', 'Nov 10, 2026']]
  },
  items: {
    section: 'Inventory', title: 'Items', description: 'Manage products, services, costs, and replenishment settings.', action: 'New item',
    summary: [['Active items', '1,284'], ['Stocked products', '986'], ['Services', '112'], ['Inventory value', '$417,900']],
    columns: ['Item', 'SKU', 'Category', 'Status', 'Unit cost'],
    rows: [['Premium Storage Bin', 'STO-1048', 'Storage', 'Active', '$28.40'], ['Wireless Barcode Scanner', 'SCN-2042', 'Equipment', 'Active', '$184.00'], ['Packing Carton - Large', 'PKG-3014', 'Packaging', 'Low stock', '$2.85'], ['Delivery Service - Local', 'SRV-1008', 'Services', 'Active', '$45.00']]
  },
  'stock-levels': {
    section: 'Inventory', title: 'Stock levels', description: 'Review availability across warehouses and bins.', action: 'Stock adjustment',
    summary: [['On hand', '48,620'], ['Available', '43,184'], ['Reserved', '5,436'], ['Below reorder', '3']],
    columns: ['Item', 'Warehouse', 'On hand', 'Status', 'Available'],
    rows: [['Premium Storage Bin', 'Central Warehouse', '1,284', 'Healthy', '1,102'], ['Wireless Barcode Scanner', 'Central Warehouse', '94', 'Healthy', '78'], ['Packing Carton - Large', 'East Distribution', '42', 'Low stock', '18'], ['Thermal Label Roll', 'West Distribution', '36', 'Reorder', '12']]
  },
  transfers: {
    section: 'Inventory', title: 'Stock transfers', description: 'Move inventory between warehouses with full traceability.', action: 'New transfer',
    summary: [['In transit', '12'], ['Awaiting dispatch', '5'], ['Received today', '8'], ['Units in transit', '1,460']],
    columns: ['Transfer', 'From', 'To', 'Status', 'Ship date'],
    rows: [['TR-2026-0188', 'Central Warehouse', 'East Distribution', 'In transit', 'Nov 11, 2026'], ['TR-2026-0187', 'West Distribution', 'Central Warehouse', 'Draft', 'Nov 12, 2026'], ['TR-2026-0186', 'Central Warehouse', 'West Distribution', 'Received', 'Nov 10, 2026'], ['TR-2026-0185', 'East Distribution', 'Central Warehouse', 'Dispatched', 'Nov 10, 2026']]
  },
  'general-ledger': {
    section: 'Finance', title: 'General ledger', description: 'Review posted journal activity across all accounts.', action: 'New journal entry',
    summary: [['Current assets', '$784,320'], ['Current liabilities', '$312,640'], ['Revenue MTD', '$284,650'], ['Net income MTD', '$54,780']],
    columns: ['Entry', 'Account', 'Description', 'Status', 'Amount'],
    rows: [['JE-2026-4418', '1100 · Accounts receivable', 'Customer invoice posting', 'Posted', '$12,480.00 Dr'], ['JE-2026-4417', '4000 · Sales revenue', 'Daily sales posting', 'Posted', '$8,920.50 Cr'], ['JE-2026-4416', '5100 · Cost of goods sold', 'Inventory issue', 'Posted', '$4,216.00 Dr'], ['JE-2026-4415', '1010 · Operating bank', 'Payment receipt', 'Draft', '$3,215.75 Dr']]
  },
  receivables: {
    section: 'Finance', title: 'Accounts receivable', description: 'Monitor customer balances, aging, and collections.', action: 'Record receipt',
    summary: [['Total outstanding', '$61,480'], ['Current', '$39,240'], ['1–30 days', '$12,860'], ['Over 30 days', '$9,380']],
    columns: ['Customer', 'Current', '1–30 days', 'Status', 'Total due'],
    rows: [['Atlas Retail Group', '$12,480.00', '$5,940.00', 'Current', '$18,420.00'], ['Meridian Foods', '$8,920.50', '$3,960.00', 'Current', '$12,880.50'], ['Beacon Hospitality', '$4,000.00', '$5,740.00', 'Overdue', '$9,740.00'], ['Summit Office Co.', '$7,215.75', '$0.00', 'Current', '$7,215.75']]
  }
};

const menuGroups = [
  { section: 'Workspace', items: [['dashboard', 'Overview', '../dashboard.html'], ['approvals', 'My approvals', 'approvals.html'], ['components', 'Components', 'components.html']] },
  { section: 'Operations', label: 'Sales & CRM', key: 'sales', items: [['customers', 'Customers'], ['quotations', 'Quotations'], ['sales-orders', 'Sales orders'], ['invoices', 'Invoices']] },
  { label: 'Purchasing', key: 'purchasing', items: [['vendors', 'Vendors'], ['purchase-orders', 'Purchase orders'], ['goods-receipts', 'Goods receipts']] },
  { label: 'Inventory', key: 'inventory', items: [['items', 'Items'], ['stock-levels', 'Stock levels'], ['transfers', 'Transfers']] },
  { section: 'Management', label: 'Finance', key: 'finance', items: [['general-ledger', 'General ledger'], ['receivables', 'Receivables'], ['financial-reports', 'Financial reports']] },
  { items: [['human-resources', 'Human resources'], ['administration', 'Administration']] }
];

const groupFor = key => {
  if (['customers', 'quotations', 'sales-orders', 'invoices'].includes(key)) return 'sales';
  if (['vendors', 'purchase-orders', 'goods-receipts'].includes(key)) return 'purchasing';
  if (['items', 'stock-levels', 'transfers'].includes(key)) return 'inventory';
  if (['general-ledger', 'receivables', 'financial-reports'].includes(key)) return 'finance';
  return null;
};

const navIcon = '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>';
const sidebar = active => menuGroups.map(group => {
  const section = group.section ? `<div class="lerp-nav-section">${group.section}</div>` : '';
  if (!group.label) return section + group.items.map(([key, label, href]) => `<a class="lerp-nav-link" href="${href ?? `${key}.html`}"${key === active ? ' aria-current="page"' : ''}><span class="lerp-nav-icon" aria-hidden="true">${navIcon}</span><span class="lerp-nav-label">${label}</span>${key === 'approvals' ? '<span class="lerp-nav-count">8</span>' : ''}</a>`).join('');
  const expanded = group.key === groupFor(active);
  return `${section}<div class="lerp-nav-group"><button class="lerp-nav-group-toggle" type="button" data-liteerp-nav-toggle aria-expanded="${expanded}"><span class="lerp-nav-icon" aria-hidden="true">${navIcon}</span><span class="lerp-nav-label">${group.label}</span><span class="lerp-nav-chevron" aria-hidden="true">›</span></button><div class="lerp-nav-submenu"><div>${group.items.map(([key, label]) => `<a class="lerp-nav-link" href="${key}.html"${key === active ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</div></div></div>`;
}).join('');

const themeButton = `<button class="lerp-icon-button lerp-theme-button" type="button" data-liteerp-theme-toggle aria-label="Use dark theme" title="Use dark theme"><svg class="lerp-theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9c0-.5 0-1-.1-1.4A7 7 0 0 1 13.4 3H12Z"/></svg><svg class="lerp-theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/></svg></button>`;

const status = value => {
  const lower = value.toLowerCase();
  const type = ['paid', 'active', 'accepted', 'approved', 'received', 'posted', 'healthy', 'inspected', 'preferred', 'ready'].some(word => lower.includes(word)) ? 'paid' :
    ['overdue', 'expired', 'credit hold', 'discrepancy', 'reorder', 'low stock'].some(word => lower.includes(word)) ? 'overdue' : 'pending';
  return `<span class="lerp-status lerp-status-${type}">${value}</span>`;
};

const listContent = page => `<div class="lerp-card"><div class="lerp-summary-strip">${page.summary.map(([label, value]) => `<div class="lerp-summary-item"><span class="lerp-summary-label">${label}</span><strong class="lerp-summary-value">${value}</strong></div>`).join('')}</div><div class="lerp-toolbar"><label class="lerp-toolbar-search"><span class="lerp-sr-only">Search ${page.title}</span><input type="search" placeholder="Search ${page.title.toLowerCase()}…"></label><select class="lerp-select" aria-label="Status filter"><option>All statuses</option><option>Active</option><option>Pending</option></select><button class="lerp-button" type="button">Filters</button><button class="lerp-button" type="button">Export</button></div><div class="lerp-table-wrap"><table class="lerp-table"><thead><tr>${page.columns.map((column, index) => `<th${index === page.columns.length - 1 ? ' class="lerp-text-end"' : ''}>${column}</th>`).join('')}</tr></thead><tbody>${page.rows.map(row => `<tr>${row.map((cell, index) => `<td${index === row.length - 1 ? ' class="lerp-text-end"' : ''}>${index === 0 ? `<span class="lerp-table-primary">${cell}</span>` : index === 3 ? status(cell) : cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div><div class="lerp-table-footer"><span>Showing ${page.rows.length} sample records</span><nav class="lerp-pagination" aria-label="Pagination"><button class="lerp-page-button" type="button" aria-label="Previous page">‹</button><button class="lerp-page-button" type="button" aria-current="page">1</button><button class="lerp-page-button" type="button">2</button><button class="lerp-page-button" type="button">3</button><button class="lerp-page-button" type="button" aria-label="Next page">›</button></nav></div></div>`;

const approvalsContent = `<div class="lerp-grid lerp-grid-4" style="margin-bottom:1rem"><article class="lerp-card lerp-metric"><span class="lerp-metric-label">Pending approval</span><strong class="lerp-metric-value">8</strong><div class="lerp-metric-foot">Across 4 workflows</div></article><article class="lerp-card lerp-metric"><span class="lerp-metric-label">High priority</span><strong class="lerp-metric-value">3</strong><div class="lerp-metric-foot">Action requested today</div></article><article class="lerp-card lerp-metric"><span class="lerp-metric-label">Approved this week</span><strong class="lerp-metric-value">24</strong><div class="lerp-metric-foot">Average 4.2 hours</div></article><article class="lerp-card lerp-metric"><span class="lerp-metric-label">Delegated</span><strong class="lerp-metric-value">2</strong><div class="lerp-metric-foot">While team members are away</div></article></div><section class="lerp-card"><header class="lerp-card-header"><div><h2 class="lerp-card-title">Approval queue</h2><p class="lerp-card-subtitle">Review business documents assigned to you</p></div></header>${[['PO-2026-0623','Purchase order · Vertex Components','$12,870.00'],['JE-2026-4412','Journal entry · Month-end accrual','$8,420.00'],['EXP-2026-0184','Expense report · Jordan Lee','$2,180.50'],['QT-2026-0418','Quotation discount · Atlas Retail','$24,850.00']].map(([id, title, amount]) => `<div class="lerp-approval"><input class="lerp-approval-check" type="checkbox" aria-label="Select ${id}"><div><div class="lerp-approval-title">${title}</div><div class="lerp-approval-meta">${id} · Submitted today</div></div><div class="lerp-cluster"><strong>${amount}</strong><button class="lerp-button" type="button">Review</button><button class="lerp-button lerp-button-primary" type="button">Approve</button></div></div>`).join('')}</section>`;

const moduleContent = (modules, activityTitle) => `<div class="lerp-module-grid">${modules.map(([icon, title, description]) => `<a class="lerp-card lerp-module-card" href="#"><span class="lerp-module-icon">${icon}</span><h2>${title}</h2><p>${description}</p></a>`).join('')}</div><section class="lerp-card" style="margin-top:1rem"><header class="lerp-card-header"><div><h2 class="lerp-card-title">${activityTitle}</h2><p class="lerp-card-subtitle">Recent workspace activity and shortcuts</p></div></header><div class="lerp-card-body"><ul class="lerp-action-list"><li class="lerp-action-item"><span class="lerp-action-icon">01</span><span class="lerp-action-copy"><span class="lerp-action-title">Workspace configuration updated</span><span class="lerp-action-meta">Today at 9:42 AM · Sam Ahmed</span></span></li><li class="lerp-action-item"><span class="lerp-action-icon">02</span><span class="lerp-action-copy"><span class="lerp-action-title">Monthly records reviewed</span><span class="lerp-action-meta">Yesterday · System workflow</span></span></li></ul></div></section>`;

const specialPages = {
  approvals: { section: 'Workspace', title: 'My approvals', description: 'Review documents waiting for your decision.', action: 'Approval settings', content: approvalsContent },
  'financial-reports': { section: 'Finance', title: 'Financial reports', description: 'Generate statements and management reports.', action: 'Create custom report', content: moduleContent([['PL','Profit & loss','Revenue, expenses, and profitability by period.'],['BS','Balance sheet','Assets, liabilities, and equity at a point in time.'],['CF','Cash flow','Operating, investing, and financing cash movement.'],['TB','Trial balance','Debit and credit balances across ledger accounts.'],['AG','Aging reports','Customer and vendor aging analysis.'],['BD','Budget variance','Compare actual results with approved budgets.']], 'Recently generated reports') },
  'human-resources': { section: 'Management', title: 'Human resources', description: 'Manage people, attendance, leave, and payroll workflows.', action: 'Add employee', content: moduleContent([['EM','Employees','Profiles, contracts, and employment information.'],['AT','Attendance','Timesheets, schedules, and attendance exceptions.'],['LV','Leave','Requests, balances, holidays, and approvals.'],['PY','Payroll','Payroll periods, earnings, deductions, and review.'],['RC','Recruitment','Job openings, candidates, and interviews.'],['PF','Performance','Goals, reviews, feedback, and development plans.']], 'HR activity') },
  administration: { section: 'Management', title: 'Administration', description: 'Configure your organization, access, and ERP policies.', action: 'System settings', content: moduleContent([['US','Users','Accounts, invitations, status, and assignments.'],['RL','Roles & permissions','Access policies by role, module, and action.'],['CO','Companies & branches','Legal entities, locations, and fiscal settings.'],['WF','Approval workflows','Rules, thresholds, approvers, and delegation.'],['TX','Taxes & currencies','Tax codes, currencies, and exchange rates.'],['AU','Audit log','Review security and business-data activity.']], 'Administrative activity') }
};

const shell = (key, page, content) => `<!doctype html><html lang="en" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="LiteERP ${page.title} example"><title>${page.title} · LiteERP</title><link rel="stylesheet" href="../../dist/liteerp.css"><script>try{const t=localStorage.getItem('liteerp-theme');if(t)document.documentElement.dataset.theme=t}catch(_){}</script></head><body><div class="lerp-app" data-liteerp-app data-sidebar-open="false"><aside id="app-sidebar" class="lerp-sidebar" data-liteerp-sidebar aria-label="Primary navigation"><a class="lerp-brand" href="../dashboard.html"><span class="lerp-brand-mark">L</span><span class="lerp-brand-name">Lite<span>ERP</span></span></a><div class="lerp-company"><span class="lerp-company-label">Active company</span><span class="lerp-company-name">Northstar Trading <span>⌄</span></span></div><nav class="lerp-nav">${sidebar(key)}</nav><div class="lerp-sidebar-footer">LiteERP v0.1 · FY 2026</div></aside><div class="lerp-sidebar-backdrop" data-liteerp-sidebar-backdrop></div><div class="lerp-main"><header class="lerp-header"><button class="lerp-icon-button lerp-mobile-toggle" type="button" data-liteerp-sidebar-toggle aria-controls="app-sidebar" aria-expanded="false" aria-label="Open navigation"><svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button><label class="lerp-search"><span class="lerp-sr-only">Global search</span><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input type="search" placeholder="Search anything…" data-liteerp-search><kbd class="lerp-shortcut">Ctrl /</kbd></label><div class="lerp-header-spacer"></div>${themeButton}<button class="lerp-icon-button" type="button" aria-label="Notifications"><svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/></svg><span class="lerp-notification-dot"></span></button><div class="lerp-user"><button class="lerp-user-button" type="button" data-liteerp-user-toggle aria-expanded="false"><span class="lerp-avatar">SA</span><span class="lerp-user-copy"><span class="lerp-user-name">Sam Ahmed</span><span class="lerp-user-role">Finance manager</span></span></button><div class="lerp-menu" data-liteerp-user-menu hidden><a href="#">My profile</a><a href="#">Preferences</a><a href="#">Sign out</a></div></div></header><main class="lerp-content"><div class="lerp-page-heading"><div><div class="lerp-eyebrow">${page.section}</div><h1 class="lerp-page-title">${page.title}</h1><p class="lerp-page-description">${page.description}</p></div><div class="lerp-cluster lerp-page-actions"><button class="lerp-button" type="button">Import</button><button class="lerp-button lerp-button-primary" type="button"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>${page.action}</button></div></div>${content}</main></div></div><script src="../../dist/liteerp.js"></script></body></html>`;

await mkdir(outputDirectory, { recursive: true });
for (const [key, page] of Object.entries(pages)) {
  await writeFile(resolve(outputDirectory, `${key}.html`), shell(key, page, listContent(page)));
}
for (const [key, page] of Object.entries(specialPages)) {
  await writeFile(resolve(outputDirectory, `${key}.html`), shell(key, page, page.content));
}
console.log(`generated ${Object.keys(pages).length + Object.keys(specialPages).length} ERP example pages`);
