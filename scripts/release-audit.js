const fs = require('node:fs');
const path = require('node:path');
const { findMissingLocalAssets } = require('./asset-integrity');

const root = path.resolve(__dirname, '..');
const ignored = new Set(['.git', 'node_modules']);
const textExtensions = new Set(['.html', '.css', '.js', '.json', '.md', '.yml', '.yaml', '.txt', '.webmanifest', '.xml']);
const forbiddenNames = new Set(['.env', '.dev.vars', 'bank-statements', 'private-fixtures', 'real-financial-data', 'F_Info_Backups']);
const failures = [];

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (forbiddenNames.has(entry.name)) failures.push(`Forbidden private/secrets path: ${path.relative(root, full)}`);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

for (const ref of findMissingLocalAssets()) failures.push(`Missing local asset: ${ref}`);

const secretPatterns = [
  ['Anthropic API key', /sk-ant-[A-Za-z0-9_-]{20,}/g],
  ['generic private key block', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g],
  ['Cloudflare token assignment', /(?:CLOUDFLARE_API_TOKEN|CF_API_TOKEN)\s*[=:]\s*['"]?[A-Za-z0-9_-]{20,}/gi]
];

for (const file of walk(root)) {
  if (!textExtensions.has(path.extname(file).toLowerCase()) && path.basename(file) !== 'manifest.webmanifest') continue;
  const source = fs.readFileSync(file, 'utf8');
  for (const [name, pattern] of secretPatterns) {
    pattern.lastIndex = 0;
    if (pattern.test(source)) failures.push(`${name} detected in ${path.relative(root, file)}`);
  }
}

if (failures.length) {
  failures.forEach(failure => console.error(`AUDIT FAIL: ${failure}`));
  process.exitCode = 1;
} else {
  console.log('Release/privacy audit passed.');
}
