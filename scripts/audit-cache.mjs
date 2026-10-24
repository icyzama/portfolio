import fs from 'node:fs';

const origin = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
const label = process.argv[2] || 'current';
if (!/^[a-z-]+$/.test(label)) throw Error('Use an alphabetic audit label.');
const projectsHtml = await (await fetch(origin + '/projects')).text();
const urls = new Map([
  ['home', '/'], ['experiences-default', '/experiences'], ['experiences-internships', '/experiences?tab=internships'],
  ['original-svg', '/skills/react.svg'], ['original-photo', '/experiences/aws-sug-ph-day-one-banner.jpg'],
]);
for (const [tag] of projectsHtml.matchAll(/<(?:script|link|img)\b[^>]*>/g)) {
  const attributes = Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key.toLowerCase(), value.replaceAll('&amp;', '&')]));
  const url = attributes.src || attributes.href;
  if (!url) continue;
  const kind = url.endsWith('.js') ? 'hashed-js' : url.endsWith('.css') ? 'hashed-css' : url.endsWith('.woff2') ? 'hashed-font' : url.startsWith('/_next/image?') ? 'optimized-image' : undefined;
  if (kind && !urls.has(kind)) urls.set(kind, url);
}
const records = [];
for (const [kind, url] of urls) {
  const first = await fetch(new URL(url, origin)); await first.arrayBuffer();
  const etag = first.headers.get('etag');
  const repeated = await fetch(new URL(url, origin), { cache: 'force-cache', headers: etag ? { 'If-None-Match': etag } : {} }); await repeated.arrayBuffer();
  records.push({ kind, url, firstStatus: first.status, repeatedStatus: repeated.status, cacheControl: first.headers.get('cache-control'), etag, vary: first.headers.get('vary') });
}
const contact = await fetch(origin + '/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
records.push({ kind: 'contact-invalid-post', firstStatus: contact.status, cacheControl: contact.headers.get('cache-control') });
const report = { generatedAt: new Date().toISOString(), origin, method: 'Local production HTTP requests followed by conditional GET when an ETag is supplied. No browser/CDN cache reuse is claimed.', records };
fs.mkdirSync('docs/qa', { recursive: true });
fs.writeFileSync(`docs/qa/cache-${label}.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(records.map(({ etag: omitted, ...record }) => ({ ...record, hasEtag: Boolean(omitted) })), null, 2));
