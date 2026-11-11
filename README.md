# LiteERP

**A framework-neutral frontend foundation for modern ERP applications.**

LiteERP is a free, responsive UI theme designed for ERP products. Its core is
plain HTML, CSS, and dependency-free JavaScript, so it can be rendered by any
server-side or client-side technology.

## Live demo

Explore the complete template suite at
[ihamarneh.github.io/LiteERP](https://ihamarneh.github.io/LiteERP/).

## Works with

- JSP, JSF, Thymeleaf, Spring MVC
- ASP.NET Razor, PHP, Django, Ruby on Rails
- React, Angular, Vue, Svelte
- Static HTML and any other system that can output HTML

LiteERP does not own routing, authentication, data fetching, or server-side
rendering. It enhances semantic markup through CSS classes and optional
`data-liteerp-*` attributes.

## License and permitted use

LiteERP is released under the [MIT License](LICENSE). You may use, copy,
modify, distribute, sublicense, and sell applications built with LiteERP,
including commercial and closed-source applications. Keep the copyright and
license notice with copies of the theme. No paid license is required.

## Quick start

### Use the ready-to-copy files

1. Download or clone the repository.
2. Copy `dist/liteerp.css` and `dist/liteerp.js` to your application's public
   assets directory.
3. Add both files to your layout.

```html
<link rel="stylesheet" href="/assets/liteerp/liteerp.css">
<script defer src="/assets/liteerp/liteerp.js"></script>
```

4. Copy markup from the relevant page under `examples/` and replace the sample
   values with output from your own templates or components.

No Node.js runtime is required in the application using LiteERP.

### Explore the examples

Open `examples/dashboard.html` in a browser. No build process or web server is
required.

For local theme development using the dependency-free development server:

```bash
npm install
npm run dev
```

Create ready-to-copy distribution assets and run project checks with:

```bash
npm run build
npm run check
```

The local server runs at `http://127.0.0.1:4173/examples/dashboard.html`.

To share the preview with devices on the same trusted network:

```bash
npm run dev:network
```

The command prints one or more LAN URLs. Keep the terminal open while others
use the preview, allow Node.js through the private-network firewall when
prompted, and stop sharing with `Ctrl+C`.

## Integrate with an application

Copy the files from `dist/` into your application's public/static assets and
include them in the page:

```html
<link rel="stylesheet" href="/assets/liteerp/liteerp.css">
<script defer src="/assets/liteerp/liteerp.js"></script>
```

The HTML remains under the application's control:

```html
<button data-liteerp-sidebar-toggle aria-controls="app-sidebar">
  Toggle menu
</button>

<aside id="app-sidebar" class="lerp-sidebar" data-liteerp-sidebar>
  <!-- Render with JSP, JSF, Thymeleaf, React, Angular, or plain HTML. -->
</aside>
```

See [docs/integrations.md](docs/integrations.md) for JSP/JSTL, JSF,
Thymeleaf, React, and Angular examples. See
[docs/architecture.md](docs/architecture.md) for the public CSS and JavaScript
contract.

## Form components

LiteERP progressively enhances standard form controls:

```html
<label class="lerp-field">
  <span>Start date</span>
  <input class="lerp-input" type="date" name="startDate">
</label>

<label class="lerp-field">
  <span>Department</span>
  <select class="lerp-select" name="department">
    <option>Finance</option>
    <option>Operations</option>
    <option>Sales</option>
  </select>
</label>
```

Date fields receive the LiteERP calendar and single-select fields become
searchable comboboxes. Their original inputs remain the source of submitted
values. Add `data-liteerp-native` to retain the browser-native control.

The live catalog is available from **Workspace → Components**.
See [docs/components.md](docs/components.md) for component markup and behavior.

## Browser behavior

The optional JavaScript currently provides:

- Responsive sidebar and backdrop
- Persistent light/dark/system theme
- Collapsible navigation groups
- User menu behavior
- Dashboard period selection
- Accessible Escape-key handling
- Client-side table search and filters
- CSV export from example tables
- Demo pagination and approval actions
- Form validation and non-persistent feedback toasts
- Tabs and notification read states
- Theme-coherent calendar date picker
- Searchable, keyboard-operable select controls

All core content stays usable when JavaScript is unavailable.

## Project structure

```text
LiteERP/
├── dist/                  Ready-to-use browser assets
├── docs/                  Architecture and integration guides
├── examples/              Complete static examples
├── src/                   Editable source assets
├── LICENSE
├── CONTRIBUTING.md
├── CHANGELOG.md
├── package.json
└── README.md
```

Generated examples are grouped by domain rather than stored in one directory:

```text
examples/pages/
├── administration/
├── auth/
├── finance/
├── hr/
├── inventory/
├── purchasing/
├── sales/
└── workspace/
```

## Included templates

The example suite contains almost 100 connected pages, including:

- Executive dashboard and global search
- Sales, purchasing, inventory, finance, HR, and administration workspaces
- List, create, edit, detail, and import flows for core ERP records
- Domain-specific forms (employment, journals, transfers, receiving, products,
  customer credit, vendor procurement, and sales documents)
- Approval queue and approval review
- Financial report catalog and report builder
- HR and administration feature workspaces
- Profile, preferences, and notifications
- Sign-in, password recovery, and error pages

All actions are intentionally frontend demonstrations. Forms validate and show
feedback but do not persist business data or call a backend.

## License

Copyright © 2026 LiteERP contributors. Released under the
[MIT License](LICENSE).

## Contributing and support

- Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing changes.
- Report security issues according to [SECURITY.md](SECURITY.md).
- Use GitHub Issues for reproducible bugs and feature proposals.
- Review [CHANGELOG.md](CHANGELOG.md) for release history.
