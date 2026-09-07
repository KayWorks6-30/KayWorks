const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { findMissingLocalAssets } = require('../scripts/asset-integrity');

const root = path.resolve(__dirname, '..');
const publicRoot = path.join(root, 'Public');
const html = fs.readFileSync(path.join(publicRoot, 'index.html'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(publicRoot, 'manifest.webmanifest'), 'utf8'));

test('required top-level KayWorks sections exist', () => {
  for (const id of ['home', 'apps', 'lab', 'about', 'technical', 'status']) {
    assert.match(html, new RegExp(`id=["']${id}["']`), `missing section #${id}`);
  }
});

test('production and demo Money Tracker links are exact', () => {
  assert.match(html, /href="https:\/\/money\.kayworks\.dev"/);
  assert.match(html, /href="https:\/\/demo-money\.kayworks\.dev"/);
});

test('WIP projects are clearly identified without fake launch URLs', () => {
  assert.match(html, /Workout \/ Fitness Tracker/);
  assert.match(html, /Ascend/);
  assert.match(html, /Planned \/ in development/);
  assert.doesNotMatch(html, /fitness\.kayworks\.dev/);
  assert.doesNotMatch(html, /ascend\.kayworks\.dev/);
});

test('local asset references resolve', () => {
  assert.deepEqual(findMissingLocalAssets(), []);
});

test('manifest is standalone and uses local icon assets', () => {
  assert.equal(manifest.name, 'KayWorks');
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.start_url, './');
  assert.ok(manifest.icons.some(icon => icon.sizes === '192x192'));
  assert.ok(manifest.icons.some(icon => icon.sizes === '512x512'));
});

test('privacy copy does not make absolute security claims', () => {
  assert.match(html, /does not make data invulnerable/i);
  assert.match(html, /browser data can be cleared/i);
  assert.doesNotMatch(html, /data can never be stolen/i);
});

test('site contains no placeholder or lorem ipsum content', () => {
  assert.doesNotMatch(html, /lorem ipsum/i);
  assert.doesNotMatch(html, /TODO|PLACEHOLDER/i);
});

test('main shell includes accessibility and PWA essentials', () => {
  assert.match(html, /class="skip-link"/);
  assert.match(html, /aria-label="Primary navigation"/);
  assert.match(html, /apple-mobile-web-app-capable/);
  assert.match(html, /rel="manifest"/);
});
