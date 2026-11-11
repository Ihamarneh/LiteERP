# Architecture

## Compatibility contract

LiteERP is a presentation layer. It accepts ordinary HTML and does not require
a particular component model, template language, router, state manager, or
backend.

1. **CSS classes are the primary API.** Applications generate semantic markup
   and apply `lerp-*` classes.
2. **JavaScript is progressive enhancement.** Interactive elements opt in with
   `data-liteerp-*` attributes.
3. **Content remains application-owned.** LiteERP never fetches or changes
   business data.
4. **State is communicated accessibly.** Interactive controls use standard
   attributes such as `aria-expanded`, `aria-current`, and `hidden`.
5. **No global framework dependency.** The distributed JavaScript is a native
   ES module and CSS does not depend on Bootstrap or another theme.

## Integration model

Server-rendered systems (JSP, JSF, Thymeleaf, Razor, PHP) render LiteERP markup
directly. Client frameworks (React, Angular, Vue) render the same class names
and may either use LiteERP's data-attribute behavior or implement state in the
framework while using LiteERP only for presentation.

## Naming

- CSS classes: `lerp-*`
- Custom properties: `--lerp-*`
- JavaScript hooks: `data-liteerp-*`
- Browser event names: `liteerp:*`

This namespace minimizes collisions with host applications.

## Theming

Set `data-theme="light"` or `data-theme="dark"` on the document element.
Applications can override public custom properties after importing LiteERP:

```css
:root {
  --lerp-brand-600: #6d28d9;
  --lerp-sidebar-width: 18rem;
  --lerp-radius-md: 0.75rem;
}
```

## JavaScript events

The shell dispatches browser events so host applications can observe UI state:

```js
document.addEventListener('liteerp:themechange', event => {
  console.log(event.detail.theme);
});
```

## Distribution policy

`src/` is the canonical editable source. `dist/` contains ready-to-copy assets
and must work without a build system. During this initial milestone the files
are intentionally identical; a future build pipeline will minify and version
the distribution without changing its public API.
