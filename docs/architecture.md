# KayWorks V2.4 architecture

KayWorks is intentionally a small static application shell.

```text
Public/
  index.html              all primary KayWorks views
  apps.html               legacy redirect -> #apps
  lab.html                legacy redirect -> #lab
  about.html              legacy redirect -> #home
  technical.html          legacy redirect -> #technical
  css/app.css
  js/app.js               view switching, mobile navigation, install dialog
  assets/
  manifest.webmanifest
  sw.js
Tests/
scripts/
docs/
```

Home, Apps, Lab, and Technical behave as separate screens, but they are rendered from one HTML shell. Navigation is hash-based so a static deployment does not need route rewriting for `/apps.html` or similar URLs. Browser back/forward navigation still works through normal hash history.

About is intentionally part of Home rather than a separate screen.

The hub itself stores no private application data. Individual KayWorks apps remain separate origins and therefore keep separate local storage.

Money Tracker is still the mature architecture reference for larger KayWorks applications, but the hub does not copy its finance-specific domain/data/parser structure because it does not need it.
