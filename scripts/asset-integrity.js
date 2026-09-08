const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const publicRoot = path.join(repoRoot, 'Public');

function localReference(value) {
  const ref = String(value || '').trim();
  if (!ref || ref.startsWith('#') || /^(?:https?:)?\/\//i.test(ref) || /^(?:mailto|tel|data|javascript):/i.test(ref)) return null;
  return ref.split(/[?#]/, 1)[0] || null;
}

function collectHtmlReferences(html) {
  const refs = [];
  for (const match of html.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)) {
    const ref = localReference(match[1]);
    if (ref) refs.push(ref);
  }
  return refs;
}

function collectManifestReferences(manifest) {
  return (manifest.icons || []).map(icon => localReference(icon.src)).filter(Boolean);
}

function findMissingLocalAssets() {
  const refs = [];
  const htmlFiles = fs.readdirSync(publicRoot).filter(name => name.endsWith('.html'));
  for (const file of htmlFiles) refs.push(...collectHtmlReferences(fs.readFileSync(path.join(publicRoot, file), 'utf8')));

  const manifestPath = path.join(publicRoot, 'manifest.webmanifest');
  if (fs.existsSync(manifestPath)) refs.push(...collectManifestReferences(JSON.parse(fs.readFileSync(manifestPath, 'utf8'))));

  const missing = [];
  for (const ref of [...new Set(refs)]) {
    const resolved = path.resolve(publicRoot, ref.replace(/^\//, ''));
    const withinRoot = resolved === publicRoot || resolved.startsWith(`${publicRoot}${path.sep}`);
    if (!withinRoot || !fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) missing.push(ref);
  }
  return missing;
}

if (require.main === module) {
  const missing = findMissingLocalAssets();
  if (missing.length) {
    for (const ref of missing) console.error(`Missing local asset: ${ref}`);
    process.exitCode = 1;
  } else console.log('Local asset integrity check passed.');
}

module.exports = { findMissingLocalAssets };
