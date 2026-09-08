# KayWorks V2.2

KayWorks is the personal hub for the web apps and side projects I build and keep around because they are useful.

V2.2 keeps the V2.1 layout and navigation intact and focuses on the site copy. Technical explanations are more direct and less concerned with defending the project choices: no branded-login language, no branded-database language, no "serious project" framing, and no launch-date commentary.

The About content still lives directly on Home, while Home, Apps, Lab, and Technical remain views inside one application shell.

## Main views

```text
#home        Home + About + current highlights
#apps        Usable apps + clearly separated demo
#lab         Work in progress
#technical   Local-first philosophy + architecture
```

Small `apps.html`, `lab.html`, `technical.html`, and `about.html` compatibility files remain only to redirect older links into the new views.

## Logo

The site now uses the supplied black-and-white raccoon-face artwork as the source for the KayWorks logo and Home Screen icons. The main Home lockup places the raccoon face above the KayWorks wordmark.

## Current apps

- **Money Tracker** — https://money.kayworks.dev
- **Money Tracker Demo** — https://demo-money.kayworks.dev

The demo is intentionally presented separately from the usable-app section and uses synthetic information.

## Technology

- semantic HTML
- vanilla CSS
- vanilla JavaScript
- static hosting
- hash-based in-page views
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

This checks local assets, JavaScript syntax, view/navigation invariants, PWA metadata, and the release/privacy audit.

## Deployment

Deploy the contents of `Public/` as the static site at `kayworks.dev`.

No build command is required. Internal KayWorks navigation uses URL hashes (`#apps`, `#lab`, and `#technical`), so those screens do not require Cloudflare to resolve separate HTML routes.

## Adding another app

When another app is genuinely usable:

1. add it to the Apps view in `Public/index.html`
2. decide whether it deserves a small Home shortcut
3. add only its real deployment URL
4. update the service worker if new local assets are introduced
5. run `npm run check`

WIP projects belong in the Lab view until they are actually ready.
