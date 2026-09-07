# KayWorks V1

KayWorks is the main website and launcher for a collection of small web applications built for practical, everyday use.

The site is intentionally not a SaaS product, account platform, or generic developer-portfolio template. It explains the KayWorks philosophy, launches finished applications, shows genuine work in progress, and documents the technical ideas behind the projects.

## Available applications

- **Money Tracker** — https://money.kayworks.dev
- **Money Tracker Demo** — https://demo-money.kayworks.dev

The demo is explicitly presented as a synthetic-data demonstration. The production application is a separate origin and does not expose shared/public financial information.

## Technology

KayWorks V1 uses:

- semantic HTML
- vanilla CSS
- vanilla JavaScript
- a web app manifest
- a small service worker for the KayWorks shell
- local static assets
- Node's built-in test runner for repository checks

There is no framework, account system, database, CMS, or application backend.

## Run locally

Requires Node 20 or newer.

```bash
npm run serve
```

Then open `http://127.0.0.1:4173`.

## Validate

```bash
npm run check
```

The check runs:

1. local asset integrity
2. JavaScript syntax validation
3. site invariant tests
4. a lightweight secrets/private-path release audit

## Repository structure

```text
Public/
  index.html
  css/app.css
  js/app.js
  assets/
  manifest.webmanifest
  sw.js
Tests/
scripts/
docs/
.github/workflows/ci.yml
package.json
README.md
```

KayWorks itself is kept smaller than Money Tracker because the hub does not need Money Tracker's finance domain, schema, parser, rules, or persistence layers.

## Deployment

Deploy the contents of `Public/` as a static site at `kayworks.dev`.

The two existing applications remain independent origins:

```text
kayworks.dev
  → KayWorks hub

money.kayworks.dev
  → Money Tracker

demo-money.kayworks.dev
  → Money Tracker Demo
```

That separation is intentional. Browser localStorage is origin-scoped, so KayWorks should not try to share application data across subdomains.

For Cloudflare Pages/static hosting, use `Public/` as the deploy directory. No build step is required.

## Adding another application

When a future app is genuinely usable:

1. update its card/status in `Public/index.html`
2. add the real deployment URL
3. update the status board
4. optionally add project-specific artwork only if it improves the page
5. run `npm run check`

Do not add fake launch URLs for projects that are still in development.

## PWA / Home Screen behavior

KayWorks includes manifest metadata, 192px/512px icons, an Apple touch icon, standalone metadata, and a small service worker. This makes the hub suitable for being added to a phone Home Screen where the browser supports it.

Installing KayWorks does **not** merge or synchronize data owned by applications on other origins. It is a launcher, not a cross-app storage layer.

## Raccoon mascot

The V1 mascot artwork is intentionally based on the existing raccoon icon embedded in the current Money Tracker reference application so the two projects feel related without copying Money Tracker's finance-specific interface.
