# KayWorks V2 architecture

KayWorks is intentionally a small static site.

```text
Public/
  index.html
  apps.html
  lab.html
  about.html
  technical.html
  css/app.css
  js/app.js
  assets/
  manifest.webmanifest
  sw.js
Tests/
scripts/
docs/
```

Each top-level section is a real page on the same KayWorks origin. Shared CSS/JavaScript keep the experience consistent without introducing a framework or client-side router.

The hub itself stores no private application data. Individual KayWorks apps remain separate origins and therefore keep separate local storage.

Money Tracker is still the mature architecture reference for larger KayWorks applications, but the hub does not copy its finance-specific domain/data/parser structure because it does not need it.
