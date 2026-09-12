const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { findMissingLocalAssets } = require('../scripts/asset-integrity');

const root = path.resolve(__dirname, '..');
const publicRoot = path.join(root, 'Public');
const read = file => fs.readFileSync(path.join(publicRoot, file), 'utf8');
const home = read('index.html');
const appJs = read('js/app.js');
const manifest = JSON.parse(read('manifest.webmanifest'));

function viewBlock(name) {
  const marker = `data-view-panel="${name}"`;
  assert.ok(home.includes(marker), `missing ${name} view`);
}

test('navigation uses same-page app views instead of server HTML routes', () => {
  for (const view of ['home', 'apps', 'lab', 'technical']) viewBlock(view);
  for (const target of ['#home', '#apps', '#lab', '#technical']) assert.match(home, new RegExp(`href=["']${target}["']`));
  assert.doesNotMatch(home, /href=["'](?:apps|lab|about|technical)\.html["']/);
  assert.match(appJs, /data-view-panel/);
  assert.match(appJs, /hashchange/);
});

test('about content now lives on Home and is not a navigation page', () => {
  assert.match(home, /<div class="kicker">About<\/div>/);
  assert.match(home, /Why I make these\./);
  assert.match(home, /I like making software in my free time/i);
  assert.doesNotMatch(home, /data-nav-view="about"/);
});

test('home copy stays personal and non-corporate', () => {
  assert.match(home, /This is where I keep the web apps I make in my free time/i);
  assert.match(home, /anyone else who finds them useful too/i);
  assert.doesNotMatch(home, /Small apps\.\s*Real uses\.\s*No nonsense/i);
  assert.doesNotMatch(home, /my family/i);
  assert.doesNotMatch(home, /Quick launcher/i);
  assert.doesNotMatch(home, /Available now/i);
});



test('public copy stays direct instead of defensive or over-branded', () => {
  assert.doesNotMatch(home, /KayWorks login/i);
  assert.doesNotMatch(home, /KayWorks database/i);
  assert.doesNotMatch(home, /KayWorks apps?/i);
  assert.doesNotMatch(home, /looks? more [“"]?serious/i);
  assert.doesNotMatch(home, /fake launch dates/i);
  assert.doesNotMatch(home, /look more official/i);
  assert.doesNotMatch(home, /pretend something is ready/i);
  assert.doesNotMatch(home, /reskinn/i);
  assert.match(home, /there is usually no reason to make you create a login first/i);
  assert.match(home, /instead of being sent to a central database/i);
  assert.match(home, /<h3>Start simple<\/h3>/i);
});

test('Money Tracker and Workout Tracker are usable apps and demo remains clearly separate', () => {
  assert.match(home, /href="https:\/\/money\.kayworks\.dev"/);
  assert.match(home, /href="https:\/\/workout\.kayworks\.dev"/);
  assert.match(home, /href="https:\/\/demo-money\.kayworks\.dev"/);
  assert.match(home, /Demo only/);
  assert.match(home, /not where you should keep your actual history/i);
});


test('UnWritten links only to the public demo and never exposes the private workspace', () => {
  assert.match(home, /<h2 id="unwrittenTitle">UnWritten<\/h2>/);
  assert.match(home, /UnWritten[\s\S]*Demo only/i);
  assert.match(home, /href="https:\/\/demo-unwritten\.kayworks\.dev"/i);
  assert.match(home, /Sample data stored in your browser/i);
  assert.match(home, /<dt>Demo status<\/dt><dd>Live<\/dd>/i);
  assert.doesNotMatch(home, /https:\/\/unwritten\.kayworks\.dev/i);
  assert.doesNotMatch(home, /Public demo coming later/i);
  assert.ok(fs.existsSync(path.join(publicRoot, 'assets', 'unwritten-icon.png')), 'missing UnWritten project icon');
});

test('Workout Tracker is promoted out of Lab while Ascend remains WIP', () => {
  const lab = home.split('data-view-panel="lab"')[1].split('data-view-panel="technical"')[0];
  assert.match(home, /<h2 id="workoutTitle">Workout Tracker<\/h2>/);
  assert.match(home, /https:\/\/workout\.kayworks\.dev/);
  assert.doesNotMatch(lab, /Workout \/ Fitness Tracker|Workout Tracker/);
  assert.match(lab, /Ascend/);
  assert.match(lab, /In development/);
  assert.doesNotMatch(home, /fitness\.kayworks\.dev/);
  assert.doesNotMatch(home, /ascend\.kayworks\.dev/);
});

test('uploaded raccoon face is the active logo and PWA icon source', () => {
  assert.match(home, /assets\/raccoon-face-source\.png/);
  assert.match(home, /assets\/favicon\.png/);
  for (const asset of ['raccoon-face-source.png', 'favicon.png', 'raccoon-192.png', 'raccoon-512.png', 'apple-touch-icon.png']) {
    assert.ok(fs.existsSync(path.join(publicRoot, 'assets', asset)), `missing ${asset}`);
  }
  assert.doesNotMatch(home, /raccoon-mascot\.svg|raccoon-mark\.svg/);
});

test('legacy HTML URLs redirect into the working app views', () => {
  assert.match(read('apps.html'), /index\.html#apps/);
  assert.match(read('lab.html'), /index\.html#lab/);
  assert.match(read('technical.html'), /index\.html#technical/);
  assert.match(read('about.html'), /index\.html#home/);
});

test('local asset references resolve', () => {
  assert.deepEqual(findMissingLocalAssets(), []);
});

test('technical copy keeps local-first limitations accurate', () => {
  assert.match(home, /clearing that browser data or losing the device/i);
  assert.match(home, /export a backup/i);
  assert.doesNotMatch(home, /data can never be stolen/i);
});

test('manifest remains standalone and uses local raccoon icons', () => {
  assert.equal(manifest.name, 'KayWorks');
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.start_url, './#home');
  assert.ok(manifest.icons.some(icon => icon.sizes === '192x192'));
  assert.ok(manifest.icons.some(icon => icon.sizes === '512x512'));
});

test('site keeps navigation and accessibility basics', () => {
  assert.match(home, /class="skip-link"/);
  assert.match(home, /aria-label="Primary navigation"/);
  assert.match(home, /rel="manifest"/);
  assert.match(home, /js\/app\.js/);
  assert.match(home, /aria-labelledby="homeTitle"/);
});

test('site contains no placeholder copy', () => {
  const textFiles = ['index.html', 'apps.html', 'lab.html', 'about.html', 'technical.html'].map(read).join('\n');
  assert.doesNotMatch(textFiles, /lorem ipsum/i);
  assert.doesNotMatch(textFiles, /TODO|PLACEHOLDER/i);
});
