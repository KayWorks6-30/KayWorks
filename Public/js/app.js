(() => {
  'use strict';

  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.getElementById('siteNav');
  const installTriggers = document.querySelectorAll('[data-install-guide]');
  const installDialog = document.getElementById('installDialog');

  const closeNav = () => {
    if (!navToggle || !siteNav) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation');
    siteNav.classList.remove('open');
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
