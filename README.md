# KayWorks V2

KayWorks is the personal hub for a small collection of web apps I build and keep around because they are useful.

V2 moves away from the more formal, company-style presentation of V1. The site is intentionally relaxed, compact, and direct. It also changes the hub from one long scrolling page into separate pages for Home, Apps, Lab, About, and Technical.

## Pages

```text
Public/
  index.html       Home
  apps.html        Usable apps + clearly separated demo
  lab.html         Work in progress
  about.html       Personal background / motivation
  technical.html   Local-first philosophy + architecture
```

## Current apps

- **Money Tracker** — https://money.kayworks.dev
- **Money Tracker Demo** — https://demo-money.kayworks.dev

The demo is intentionally presented separately from the usable-app section and uses synthetic information.

## Technology

- semantic HTML
- vanilla CSS
- vanilla JavaScript
- static hosting
- web app manifest + service worker
- Node's built-in test runner

There is no framework, account system, database, CMS, or app backend for the KayWorks hub.

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

This checks local assets across every page, JavaScript syntax, site invariants, PWA metadata, and the release/privacy audit.

## Deployment

Deploy the contents of `Public/` as the static site at `kayworks.dev`.

No build command is required.

## Adding another app

When another app is genuinely usable:

1. add it to `Public/apps.html`
2. decide whether it deserves a small Home-page shortcut
3. add only its real deployment URL
4. update `Public/sw.js` if new local page/assets are introduced
5. run `npm run check`

WIP projects belong in `lab.html` until they are actually ready.

## Design direction

KayWorks should feel related to Money Tracker without looking like a finance dashboard or a software company landing page. V2 uses smaller desktop typography, fewer promotional phrases, normal conversational copy, and a friendlier original raccoon mark/mascot.
