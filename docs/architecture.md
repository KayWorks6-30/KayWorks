# KayWorks V1 Architecture

## Architectural goal

KayWorks is a mostly static personal site and application launcher. The implementation should stay proportional to that job.

V1 therefore uses one HTML application shell, one primary stylesheet, one small browser script, a manifest, a service worker, static mascot/icon assets, and lightweight validation tooling.

## Runtime

```text
browser
  ↓
Public/index.html
  ├─ css/app.css
  ├─ js/app.js
  ├─ assets/*
  ├─ manifest.webmanifest
  └─ sw.js
```

The site has no authentication, account state, remote user profiles, database, or application backend.

## Why this is simpler than Money Tracker

Money Tracker is a mature domain application with persistence, schema/migrations, import/export, financial-domain logic, parser/validation, rules, UI controllers, tests, and release tooling.

KayWorks does not need to copy those layers because it does not own comparable application data or domain behavior.

The reusable lesson is the boundary philosophy rather than the file count:

```text
UI → domain/data interfaces
AI/parser → validation → deterministic behavior
application state → explicit persistence boundary
```

A future KayWorks application should gain structure when its complexity makes the boundaries useful.

## Application origins

```text
kayworks.dev                 hub
money.kayworks.dev           Money Tracker
 demo-money.kayworks.dev     Money Tracker Demo
```

These are separate browser origins. Local storage is intentionally not shared between them.

## PWA boundary

KayWorks V1's service worker only handles assets on the KayWorks origin and scope. It does not intercept or cache application subdomains.

## Security/privacy boundary

The hub contains no personal application state. The repository audit checks for obvious secrets and known private-path patterns. No financial fixtures or user backups belong in this repository.
