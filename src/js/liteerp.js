/* LiteERP v0.1.0 | MIT License */
const root = document.documentElement;
const app = document.querySelector('[data-liteerp-app]');
const sidebarToggles = document.querySelectorAll('[data-liteerp-sidebar-toggle]');
const backdrop = document.querySelector('[data-liteerp-sidebar-backdrop]');
const themeButtons = document.querySelectorAll('[data-liteerp-theme-toggle]');
const userButton = document.querySelector('[data-liteerp-user-toggle]');
const userMenu = document.querySelector('[data-liteerp-user-menu]');

const emit = (name, detail) => {
  document.dispatchEvent(new CustomEvent(`liteerp:${name}`, { detail }));
};

const safeStorage = {
  get(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); } catch { /* Storage is optional. */ }
  }
};

const preferredTheme = () => {
  const saved = safeStorage.get('liteerp-theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const setTheme = (theme, persist = true) => {
  root.dataset.theme = theme;
  if (persist) safeStorage.set('liteerp-theme', theme);
  themeButtons.forEach(button => {
    button.setAttribute('aria-label', theme === 'dark' ? 'Use light theme' : 'Use dark theme');
    button.setAttribute('title', theme === 'dark' ? 'Use light theme' : 'Use dark theme');
  });
  emit('themechange', { theme });
};

setTheme(preferredTheme(), false);

const closeSidebar = () => {
  if (!app) return;
  app.dataset.sidebarOpen = 'false';
  sidebarToggles.forEach(toggle => toggle.setAttribute('aria-expanded', 'false'));
};

sidebarToggles.forEach(toggle => {
  toggle.addEventListener('click', () => {
    if (!app) return;
    const isOpen = app.dataset.sidebarOpen === 'true';
    app.dataset.sidebarOpen = String(!isOpen);
    sidebarToggles.forEach(item => item.setAttribute('aria-expanded', String(!isOpen)));
    emit('sidebarchange', { open: !isOpen });
  });
});

backdrop?.addEventListener('click', closeSidebar);

themeButtons.forEach(button => {
  button.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });
});

document.querySelectorAll('[data-liteerp-nav-toggle]').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
  });
});

userButton?.addEventListener('click', event => {
  event.stopPropagation();
  const willOpen = userMenu?.hasAttribute('hidden');
  userMenu?.toggleAttribute('hidden', !willOpen);
  userButton.setAttribute('aria-expanded', String(willOpen));
});

document.addEventListener('click', event => {
  if (userMenu && !userMenu.contains(event.target) && event.target !== userButton) {
    userMenu.hidden = true;
    userButton?.setAttribute('aria-expanded', 'false');
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeSidebar();
    if (userMenu) userMenu.hidden = true;
    userButton?.setAttribute('aria-expanded', 'false');
  }
  if ((event.ctrlKey || event.metaKey) && event.key === '/') {
    event.preventDefault();
    document.querySelector('[data-liteerp-search]')?.focus();
  }
});

document.querySelector('[data-liteerp-period]')?.addEventListener('change', event => {
  emit('periodchange', { period: event.target.value });
});

window.matchMedia('(min-width: 992px)').addEventListener('change', event => {
  if (event.matches) closeSidebar();
});

const toast = message => {
  let region = document.querySelector('[data-liteerp-toast-region]');
  if (!region) {
    region = document.createElement('div');
    region.className = 'lerp-toast-region';
    region.dataset.liteerpToastRegion = '';
    region.setAttribute('aria-live', 'polite');
    document.body.append(region);
  }
  const item = document.createElement('div');
  item.className = 'lerp-toast';
  item.textContent = message;
  region.append(item);
  window.setTimeout(() => item.remove(), 3500);
};

document.querySelectorAll('[data-liteerp-table-search]').forEach(input => {
  input.addEventListener('input', () => {
    const table = document.querySelector(input.dataset.liteerpTableSearch);
    const query = input.value.trim().toLowerCase();
    table?.querySelectorAll('tbody tr').forEach(row => {
      row.hidden = query.length > 0 && !row.textContent.toLowerCase().includes(query);
    });
  });
});

document.querySelectorAll('[data-liteerp-filter-toggle]').forEach(button => {
  button.addEventListener('click', () => {
    const panel = document.querySelector(button.dataset.liteerpFilterToggle);
    if (!panel) return;
    panel.hidden = !panel.hidden;
    button.setAttribute('aria-expanded', String(!panel.hidden));
  });
});

document.querySelectorAll('[data-liteerp-export]').forEach(button => {
  button.addEventListener('click', () => {
    const table = document.querySelector(button.dataset.liteerpExport);
    if (!table) return;
    const csv = [...table.querySelectorAll('tr')].filter(row => !row.hidden).map(row =>
      [...row.children].map(cell => `"${cell.textContent.trim().replaceAll('"', '""')}"`).join(',')
    ).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    link.download = `${document.title.split(' · ')[0].toLowerCase().replaceAll(' ', '-')}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast('CSV export created.');
  });
});

document.querySelectorAll('[data-liteerp-page]').forEach(button => {
  button.addEventListener('click', () => {
    const pagination = button.closest('.lerp-pagination');
    pagination?.querySelectorAll('[aria-current]').forEach(item => item.removeAttribute('aria-current'));
    button.setAttribute('aria-current', 'page');
    toast(`Showing sample page ${button.textContent.trim()}.`);
  });
});

document.querySelectorAll('[data-liteerp-demo-form]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    toast(form.dataset.successMessage || 'Changes validated successfully.');
    emit('formsubmit', { form });
  });
});

document.querySelectorAll('[data-liteerp-demo-action]').forEach(button => {
  button.addEventListener('click', () => {
    const message = button.dataset.liteerpDemoAction || 'Action completed in demo mode.';
    const approval = button.closest('.lerp-approval');
    if (approval && message.toLowerCase().includes('approved')) {
      approval.style.opacity = '.55';
      button.disabled = true;
      button.textContent = 'Approved';
    }
    toast(message);
  });
});

document.querySelectorAll('[data-liteerp-mark-read]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.lerp-notification-item').forEach(item => item.dataset.read = 'true');
    toast('All notifications marked as read.');
  });
});

document.querySelectorAll('[data-liteerp-tab]').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabList = tab.closest('[role="tablist"]');
    const card = tab.closest('.lerp-card');
    tabList?.querySelectorAll('[role="tab"]').forEach(item => item.setAttribute('aria-selected', 'false'));
    card?.querySelectorAll('[role="tabpanel"]').forEach(panel => panel.hidden = true);
    tab.setAttribute('aria-selected', 'true');
    const panel = document.querySelector(tab.getAttribute('aria-controls') ? `#${tab.getAttribute('aria-controls')}` : '');
    if (panel) panel.hidden = false;
  });
});

/* Searchable select ------------------------------------------------------- */
let componentId = 0;
const openPopovers = new Set();
const closePopovers = except => {
  openPopovers.forEach(close => { if (close !== except) close(); });
};

document.querySelectorAll('select:not([multiple]):not([data-liteerp-native])').forEach(select => {
  const wrapper = document.createElement('div');
  const input = document.createElement('input');
  const menu = document.createElement('div');
  const optionsBox = document.createElement('div');
  const id = `lerp-combobox-${++componentId}`;
  let visibleOptions = [];
  let activeIndex = -1;

  wrapper.className = 'lerp-combobox';
  wrapper.dataset.open = 'false';
  input.className = 'lerp-combobox-input';
  input.type = 'text';
  input.autocomplete = 'off';
  input.disabled = select.disabled;
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-controls', id);
  menu.className = 'lerp-combobox-menu';
  menu.hidden = true;
  menu.id = id;
  optionsBox.className = 'lerp-combobox-options';
  optionsBox.setAttribute('role', 'listbox');
  menu.append(optionsBox);

  select.before(wrapper);
  select.classList.add('lerp-native-control');
  wrapper.append(select, input, menu);
  wrapper.addEventListener('click', event => event.stopPropagation());

  const selectedLabel = () => select.selectedOptions[0]?.textContent.trim() ?? '';
  const close = () => {
    menu.hidden = true;
    wrapper.dataset.open = 'false';
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    input.value = selectedLabel();
    activeIndex = -1;
  };
  openPopovers.add(close);

  const choose = option => {
    select.value = option.value;
    input.value = option.textContent.trim();
    select.dispatchEvent(new Event('input', { bubbles: true }));
    select.dispatchEvent(new Event('change', { bubbles: true }));
    close();
    input.focus();
  };

  const render = query => {
    const normalized = query.trim().toLowerCase();
    visibleOptions = [...select.options].filter(option => !option.disabled && option.textContent.toLowerCase().includes(normalized));
    optionsBox.replaceChildren();
    if (!visibleOptions.length) {
      const empty = document.createElement('div');
      empty.className = 'lerp-combobox-empty';
      empty.textContent = 'No matching options';
      optionsBox.append(empty);
      return;
    }
    visibleOptions.forEach((option, index) => {
      const button = document.createElement('button');
      button.className = 'lerp-combobox-option';
      button.type = 'button';
      button.id = `${id}-option-${index}`;
      button.setAttribute('role', 'option');
      button.setAttribute('aria-selected', String(option.selected));
      button.textContent = option.textContent;
      button.addEventListener('mousedown', event => event.preventDefault());
      button.addEventListener('click', event => {
        event.stopPropagation();
        choose(option);
      });
      optionsBox.append(button);
    });
  };

  const open = (clearSearch = false) => {
    closePopovers(close);
    if (clearSearch) input.value = '';
    render(clearSearch ? '' : input.value === selectedLabel() ? '' : input.value);
    menu.hidden = false;
    wrapper.dataset.open = 'true';
    input.setAttribute('aria-expanded', 'true');
  };

  const setActive = index => {
    const buttons = [...optionsBox.querySelectorAll('.lerp-combobox-option')];
    if (!buttons.length) return;
    activeIndex = (index + buttons.length) % buttons.length;
    buttons.forEach((button, itemIndex) => button.dataset.active = String(itemIndex === activeIndex));
    input.setAttribute('aria-activedescendant', buttons[activeIndex].id);
    buttons[activeIndex].scrollIntoView({ block: 'nearest' });
  };

  input.value = selectedLabel();
  input.addEventListener('focus', () => { open(); input.select(); });
  input.addEventListener('click', () => open());
  input.addEventListener('input', () => { open(); render(input.value); activeIndex = -1; });
  input.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') { event.preventDefault(); if (menu.hidden) open(true); setActive(activeIndex + 1); }
    if (event.key === 'ArrowUp') { event.preventDefault(); if (menu.hidden) open(true); setActive(activeIndex - 1); }
    if (event.key === 'Enter' && !menu.hidden) {
      event.preventDefault();
      const option = visibleOptions[activeIndex >= 0 ? activeIndex : 0];
      if (option) choose(option);
    }
    if (event.key === 'Escape') { event.preventDefault(); close(); }
  });
  select.addEventListener('change', () => { input.value = selectedLabel(); });
  select.form?.addEventListener('reset', () => window.setTimeout(() => { input.value = selectedLabel(); }, 0));
});

/* Calendar date picker ---------------------------------------------------- */
document.querySelectorAll('input[type="date"]:not([data-liteerp-native])').forEach(dateInput => {
  const wrapper = document.createElement('div');
  const trigger = document.createElement('button');
  const valueLabel = document.createElement('span');
  const calendar = document.createElement('div');
  const title = document.createElement('div');
  const grid = document.createElement('div');
  const id = `lerp-calendar-${++componentId}`;
  const today = new Date();
  let viewDate;

  const parseDate = value => {
    const [year, month, day] = value.split('-').map(Number);
    return year && month && day ? new Date(year, month - 1, day) : null;
  };
  const toISO = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const formatDate = date => new Intl.DateTimeFormat(document.documentElement.lang || 'en', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
  const selectedDate = () => parseDate(dateInput.value);
  const minDate = parseDate(dateInput.min);
  const maxDate = parseDate(dateInput.max);

  wrapper.className = 'lerp-date';
  trigger.className = 'lerp-date-trigger';
  trigger.type = 'button';
  trigger.disabled = dateInput.disabled;
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', id);
  trigger.append(valueLabel);
  trigger.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>');
  calendar.className = 'lerp-calendar';
  calendar.id = id;
  calendar.hidden = true;
  calendar.setAttribute('role', 'dialog');
  calendar.setAttribute('aria-label', 'Choose date');
  calendar.innerHTML = '<div class="lerp-calendar-header"><button class="lerp-calendar-nav" type="button" data-calendar-prev aria-label="Previous month">‹</button><div class="lerp-calendar-title"></div><button class="lerp-calendar-nav" type="button" data-calendar-next aria-label="Next month">›</button></div><div class="lerp-calendar-weekdays" aria-hidden="true"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div><div class="lerp-calendar-grid"></div><div class="lerp-calendar-footer"><button class="lerp-calendar-action" type="button" data-calendar-clear>Clear</button><button class="lerp-calendar-action" type="button" data-calendar-today>Today</button></div>';
  title.replaceWith(calendar.querySelector('.lerp-calendar-title'));
  grid.replaceWith(calendar.querySelector('.lerp-calendar-grid'));

  dateInput.before(wrapper);
  dateInput.classList.add('lerp-native-control');
  wrapper.append(dateInput, trigger, calendar);
  const calendarTitle = calendar.querySelector('.lerp-calendar-title');
  const calendarGrid = calendar.querySelector('.lerp-calendar-grid');

  const updateLabel = () => {
    const selected = selectedDate();
    valueLabel.textContent = selected ? formatDate(selected) : 'Choose a date';
    valueLabel.className = selected ? '' : 'lerp-date-placeholder';
  };
  const selectDate = date => {
    dateInput.value = date ? toISO(date) : '';
    dateInput.dispatchEvent(new Event('input', { bubbles: true }));
    dateInput.dispatchEvent(new Event('change', { bubbles: true }));
    updateLabel();
    close();
    trigger.focus();
  };
  const renderCalendar = () => {
    calendarTitle.textContent = new Intl.DateTimeFormat(document.documentElement.lang || 'en', { month: 'long', year: 'numeric' }).format(viewDate);
    calendarGrid.replaceChildren();
    const first = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const days = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    for (let blank = 0; blank < first.getDay(); blank++) calendarGrid.append(document.createElement('span'));
    for (let day = 1; day <= days; day++) {
      const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
      const button = document.createElement('button');
      button.className = 'lerp-calendar-day';
      button.type = 'button';
      button.textContent = String(day);
      button.disabled = Boolean((minDate && date < minDate) || (maxDate && date > maxDate));
      button.dataset.today = String(toISO(date) === toISO(today));
      button.setAttribute('aria-pressed', String(dateInput.value === toISO(date)));
      button.setAttribute('aria-label', formatDate(date));
      button.addEventListener('click', () => selectDate(date));
      calendarGrid.append(button);
    }
  };
  const close = () => {
    calendar.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
  };
  const open = () => {
    closePopovers(close);
    const selected = selectedDate() ?? today;
    viewDate = new Date(selected.getFullYear(), selected.getMonth(), 1);
    renderCalendar();
    calendar.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
  };
  openPopovers.add(close);

  trigger.addEventListener('click', event => { event.stopPropagation(); calendar.hidden ? open() : close(); });
  calendar.addEventListener('click', event => event.stopPropagation());
  calendar.querySelector('[data-calendar-prev]').addEventListener('click', () => { viewDate.setMonth(viewDate.getMonth() - 1); renderCalendar(); });
  calendar.querySelector('[data-calendar-next]').addEventListener('click', () => { viewDate.setMonth(viewDate.getMonth() + 1); renderCalendar(); });
  calendar.querySelector('[data-calendar-clear]').addEventListener('click', () => selectDate(null));
  calendar.querySelector('[data-calendar-today]').addEventListener('click', () => selectDate(today));
  dateInput.addEventListener('change', updateLabel);
  dateInput.form?.addEventListener('reset', () => window.setTimeout(updateLabel, 0));
  updateLabel();
});

document.addEventListener('click', () => closePopovers());
