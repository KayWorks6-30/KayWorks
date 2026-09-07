(() => {
  'use strict';

  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.getElementById('siteNav');
  const navLinks = [...document.querySelectorAll('[data-nav]')];
  const sections = [...document.querySelectorAll('[data-section]')];
  const installButton = document.getElementById('installButton');
  const installDialog = document.getElementById('installDialog');
  const standaloneStatus = document.getElementById('standaloneStatus');
  let deferredInstallPrompt = null;

  function closeNavigation() {
    if (!navToggle || !siteNav) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation');
    siteNav.classList.remove('open');
  }

  function toggleNavigation() {
    if (!navToggle || !siteNav) return;
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    siteNav.classList.toggle('open', !isOpen);
  }

  function syncStandaloneStatus() {
    if (!standaloneStatus) return;
    const displayStandalone = window.matchMedia?.('(display-mode: standalone)').matches === true;
    const iosStandalone = window.navigator.standalone === true;
    const standalone = displayStandalone || iosStandalone;
    standaloneStatus.textContent = standalone ? '✓ Running in Home Screen mode' : 'Browser mode';
    standaloneStatus.classList.toggle('detected', standalone);
  }

  function openGuide() {
    if (!installDialog) return;
    if (typeof installDialog.showModal === 'function') installDialog.showModal();
    else installDialog.setAttribute('open', '');
  }

  async function handleInstall() {
    if (!deferredInstallPrompt) {
      openGuide();
      return;
    }
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice.catch(() => null);
    deferredInstallPrompt = null;
    if (installButton) installButton.textContent = 'Home Screen guide';
    syncStandaloneStatus();
  }

  function setActiveNav(sectionId) {
    for (const link of navLinks) link.classList.toggle('active', link.dataset.nav === sectionId);
  }

  navToggle?.addEventListener('click', toggleNavigation);
  siteNav?.addEventListener('click', event => {
    if (event.target.closest('a')) closeNavigation();
  });

  document.addEventListener('click', event => {
    if (!siteNav?.classList.contains('open')) return;
    if (event.target.closest('.site-header')) return;
    closeNavigation();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeNavigation();
      if (installDialog?.open) installDialog.close();
    }
  });

  installButton?.addEventListener('click', handleInstall);
  installDialog?.querySelector('.dialog-close')?.addEventListener('click', () => installDialog.close());
  installDialog?.querySelector('.dialog-done')?.addEventListener('click', () => installDialog.close());
  installDialog?.addEventListener('click', event => {
    const rect = installDialog.getBoundingClientRect();
    const clickedBackdrop = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (clickedBackdrop) installDialog.close();
  });

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    if (installButton) installButton.textContent = 'Install KayWorks';
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    if (installButton) installButton.textContent = 'Home Screen guide';
    syncStandaloneStatus();
  });

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveNav(visible.target.dataset.section);
    }, { rootMargin: '-25% 0px -62% 0px', threshold: [0, .12, .35] });
    sections.forEach(section => observer.observe(section));
  } else {
    setActiveNav('home');
  }

  const displayQuery = window.matchMedia?.('(display-mode: standalone)');
  if (displayQuery?.addEventListener) displayQuery.addEventListener('change', syncStandaloneStatus);
  else if (displayQuery?.addListener) displayQuery.addListener(syncStandaloneStatus);
  syncStandaloneStatus();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }
})();
