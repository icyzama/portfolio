import fs from 'node:fs';
import { brotliCompressSync, constants } from 'node:zlib';

const origin = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
const label = process.argv[2] || 'current';
if (!/^[a-z-]+$/.test(label)) throw Error('Use an alphabetic audit label.');
const resources = new Map();
async function resource(url) {
  if (!resources.has(url)) {
    const response = await fetch(new URL(url, origin));
    if (!response.ok) throw Error('Failed resource: ' + url);
    const bytes = Buffer.from(await response.arrayBuffer());
    resources.set(url, { url, decodedBytes: bytes.length, brotliBytesEstimate: brotliCompressSync(bytes, { params: { [constants.BROTLI_PARAM_QUALITY]: 5 } }).length });
  }
  return resources.get(url);
}
const pages = [];
for (const route of ['/', '/about', '/experiences', '/projects', '/blog', '/services', '/contact']) {
  const start = performance.now();
  const response = await fetch(origin + route); const headersAt = performance.now(); const html = await response.text();
  if (!response.ok) throw Error('Failed route: ' + route);
  const initialResources = { js: new Set(), css: new Set(), fonts: new Set() };
  for (const [tag] of html.matchAll(/<(?:script|link)\b[^>]*>/g)) {
    const attributes = Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key.toLowerCase(), value.replaceAll('&amp;', '&')]));
    const url = attributes.src || attributes.href;
    if (!url?.startsWith('/_next/')) continue;
    if (url.endsWith('.js')) initialResources.js.add(url);
    if (attributes.rel === 'stylesheet') initialResources.css.add(url);
    if (attributes.as === 'font') initialResources.fonts.add(url);
  }
  const measured = {};
  for (const [kind, urls] of Object.entries(initialResources)) {
    const assets = await Promise.all([...urls].map(resource));
    measured[kind] = { count: assets.length, decodedBytes: assets.reduce((sum, item) => sum + item.decodedBytes, 0), brotliBytesEstimate: assets.reduce((sum, item) => sum + item.brotliBytesEstimate, 0), assets };
  }
  pages.push({ route, htmlBytes: Buffer.byteLength(html), localTimeToHeadersMs: Math.round((headersAt - start) * 100) / 100, ...measured });
}
const report = { generatedAt: new Date().toISOString(), label, origin, method: 'Local production HTML and referenced initial JS/CSS/font resource bodies, no browser, viewport emulation or CPU/network throttling. Brotli estimates use quality 5. Local response-header timings are diagnostics, not browser paint, interaction or real-user metrics. Image requests are excluded. Resource bodies are reused across page measurements within this run.', heaviestJavaScriptRoute: [...pages].sort((a, b) => b.js.decodedBytes - a.js.decodedBytes)[0].route, pages };
fs.mkdirSync('docs/qa', { recursive: true });
fs.writeFileSync(`docs/qa/performance-${label}.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ heaviestJavaScriptRoute: report.heaviestJavaScriptRoute, pages: pages.map(page => ({ route: page.route, jsBytes: page.js.decodedBytes, cssBytes: page.css.decodedBytes, fontBytes: page.fonts.decodedBytes })) }, null, 2));
