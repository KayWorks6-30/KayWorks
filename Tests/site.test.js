const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { findMissingLocalAssets } = require('../scripts/asset-integrity');

const root = path.resolve(__dirname, '..');
const publicRoot = path.join(root, 'Public');
const read = file => fs.readFileSync(path.join(publicRoot, file), 'utf8');
const pages = ['index.html', 'apps.html', 'lab.html', 'about.html', 'technical.html'];
const allHtml = pages.map(read).join('\n');
const manifest = JSON.parse(read('manifest.webmanifest'));

test('V2 uses separate site pages instead of one long anchor page', () => {
  for (const page of pages) assert.ok(fs.existsSync(path.join(publicRoot, page)), `missing ${page}`);
  for (const target of ['apps.html', 'lab.html', 'about.html', 'technical.html']) assert.match(read('index.html'), new RegExp(`href=["']${target}["']`));
  assert.doesNotMatch(read('index.html'), /href=["']#(?:apps|lab|about|technical)["']/);
});

test('home copy is personal and removes the V1 marketing slogan', () => {
  const home = read('index.html');
  assert.match(home, /This is where I keep the web apps I build/i);
  assert.doesNotMatch(home, /Small apps\.\s*Real uses\.\s*No nonsense/i);
  assert.doesNotMatch(home, /my family/i);
  assert.doesNotMatch(home, /Quick launcher/i);
  assert.doesNotMatch(home, /Available now/i);
});

test('Money Tracker is the usable app and demo is visually/copy separated', () => {
  const apps = read('apps.html');
  assert.match(apps, /href="https:\/\/money\.kayworks\.dev"/);
  assert.match(apps, /href="https:\/\/demo-money\.kayworks\.dev"/);
  assert.match(apps, /Demo only/);
  assert.match(apps, /not where you should keep your actual history/i);
});

test('WIP projects exist without fake launch domains', () => {
  const lab = read('lab.html');
  assert.match(lab, /Workout \/ Fitness Tracker/);
  assert.match(lab, /Ascend/);
  assert.match(lab, /In development/);
  assert.doesNotMatch(allHtml, /fitness\.kayworks\.dev/);
  assert.doesNotMatch(allHtml, /ascend\.kayworks\.dev/);
});

test('local asset references resolve across every page', () => {
  assert.deepEqual(findMissingLocalAssets(), []);
});

test('new mascot assets are used', () => {
  assert.match(read('index.html'), /raccoon-mascot\.svg/);
  assert.match(allHtml, /raccoon-mark\.svg/);
  assert.ok(fs.existsSync(path.join(publicRoot, 'assets', 'raccoon-mascot.svg')));
  assert.ok(fs.existsSync(path.join(publicRoot, 'assets', 'raccoon-mark.svg')));
});

test('technical page keeps local-first limitations accurate', () => {
  const technical = read('technical.html');
  assert.match(technical, /does not make the data invulnerable/i);
  assert.match(technical, /browser storage is cleared/i);
  assert.doesNotMatch(technical, /data can never be stolen/i);
});

test('manifest remains standalone and uses local icons', () => {
  assert.equal(manifest.name, 'KayWorks');
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.start_url, './');
  assert.ok(manifest.icons.some(icon => icon.sizes === '192x192'));
  assert.ok(manifest.icons.some(icon => icon.sizes === '512x512'));
});

test('every page has navigation and accessibility basics', () => {
  for (const page of pages) {
    const html = read(page);
    assert.match(html, /class="skip-link"/);
    assert.match(html, /aria-label="Primary navigation"/);
    assert.match(html, /rel="manifest"/);
    assert.match(html, /js\/app\.js/);
  }
});

test('site contains no placeholder copy', () => {
  assert.doesNotMatch(allHtml, /lorem ipsum/i);
  assert.doesNotMatch(allHtml, /TODO|PLACEHOLDER/i);
});
