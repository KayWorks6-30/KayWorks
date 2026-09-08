(() => {
  'use strict';

  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.getElementById('siteNav');
  const navLinks = [...document.querySelectorAll('[data-nav-view]')];
  const panels = [...document.querySelectorAll('[data-view-panel]')];
  const installTriggers = document.querySelectorAll('[data-install-guide]');
  const installDialog = document.getElementById('installDialog');
  const validViews = new Set(panels.map(panel => panel.dataset.viewPanel));

  const pageTitles = {
    home: 'KayWorks',
    apps: 'Apps — KayWorks',
    lab: 'Lab — KayWorks',
    technical: 'Technical — KayWorks'
  };

  const closeNav = () => {
    if (!navToggle || !siteNav) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation');
    siteNav.classList.remove('open');
  };

  const currentView = () => {
    const requested = window.location.hash.slice(1).toLowerCase();
    return validViews.has(requested) ? requested : 'home';
  };

  const showView = (view, { scroll = true } = {}) => {
    const safeView = validViews.has(view) ? view : 'home';

    panels.forEach(panel => {
      const active = panel.dataset.viewPanel === safeView;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });

    navLinks.forEach(link => {
      const active = link.dataset.navView === safeView;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    document.title = pageTitles[safeView] || pageTitles.home;
    closeNav();

    if (scroll) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      document.querySelector(`[data-view-panel="${safeView}"]`)?.focus?.({ preventScroll: true });
    }
  };

  navToggle?.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!open));
    navToggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
    siteNav?.classList.toggle('open', !open);
  });

  siteNav?.addEventListener('click', event => {
    if (event.target.closest('a')) closeNav();
  });

  document.addEventListener('click', event => {
    if (!siteNav?.classList.contains('open')) return;
    if (event.target.closest('.site-header')) return;
    closeNav();
  });

  window.addEventListener('hashchange', () => showView(currentView()));

  if (!window.location.hash || !validViews.has(window.location.hash.slice(1).toLowerCase())) {
    history.replaceState(null, '', '#home');
  }
  showView(currentView(), { scroll: false });

  installTriggers.forEach(trigger => trigger.addEventListener('click', () => {
    if (!installDialog) return;
    if (typeof installDialog.showModal === 'function') installDialog.showModal();
    else installDialog.setAttribute('open', '');
  }));

  installDialog?.querySelector('.dialog-close')?.addEventListener('click', () => installDialog.close());
  installDialog?.addEventListener('click', event => {
    const rect = installDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) installDialog.close();
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    closeNav();
    if (installDialog?.open) installDialog.close();
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
