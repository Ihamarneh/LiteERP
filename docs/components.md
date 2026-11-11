# Form components

LiteERP components use progressive enhancement. Applications continue to own
ordinary HTML controls, names, values, validation, and form submission.

## Calendar

Any standard date input is enhanced automatically:

```html
<label class="lerp-field">
  <span>Employment start date</span>
  <input class="lerp-input"
         type="date"
         name="startDate"
         min="2020-01-01"
         max="2030-12-31"
         required>
</label>
```

The component supports month navigation, today, clear, minimum and maximum
dates, selected and current-day states, dark mode, and responsive positioning.
The original input retains its ISO `YYYY-MM-DD` value.

## Searchable select

Standard single-select controls become searchable comboboxes:

```html
<label class="lerp-field">
  <span>Department</span>
  <select class="lerp-select" name="department">
    <option value="finance">Finance</option>
    <option value="operations">Operations</option>
    <option value="sales">Sales</option>
  </select>
</label>
```

Users can type to filter and use Arrow Up, Arrow Down, Enter, and Escape. The
underlying select receives normal `input` and `change` events and remains the
submitted form control.

## Opting out

Use the browser-native rendering for a particular control when needed:

```html
<input type="date" data-liteerp-native>
<select data-liteerp-native>...</select>
```

## Server and framework integration

JSP, JSF, Thymeleaf, Razor, PHP, and similar technologies only need to render
the standard controls. For React, Angular, Vue, or another client renderer,
load LiteERP after the initial application markup is mounted, or manage the
control interaction in the framework while retaining LiteERP classes.
