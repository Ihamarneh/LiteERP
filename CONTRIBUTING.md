# Contributing to LiteERP

Thank you for helping improve LiteERP.

## Development setup

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev
```

Before submitting a change:

```bash
npm run build
npm run check
npm audit
```

## Project conventions

- Keep the core framework-neutral and dependency-free at runtime.
- Use the `lerp-` prefix for CSS classes and `--lerp-` for CSS variables.
- Use `data-liteerp-*` for optional JavaScript behavior.
- Preserve ordinary HTML inputs as the source of form values.
- Ensure components work in light and dark themes and at mobile widths.
- Use semantic HTML and include keyboard and screen-reader behavior.
- Add ERP-specific examples rather than generic dashboard filler.
- Do not copy source code, layouts, assets, or branding from other themes.

Generated example pages come from scripts in `scripts/`. Update the generator,
not only generated HTML, then run `npm run build`.

## Pull requests

Keep pull requests focused. Explain the user-facing change, include testing
steps, and add screenshots for visual changes when possible. By contributing,
you agree that your contribution is licensed under the MIT License.
