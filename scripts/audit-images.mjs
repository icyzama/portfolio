import fs from 'node:fs';

const origin = 'http://127.0.0.1:3000';
const label = process.argv[2] || 'current';
if (!/^[a-z-]+$/.test(label)) throw Error('Use a simple alphabetic audit label.');
const html = await (await fetch(origin + '/projects')).text();
const tags = [...html.matchAll(/<img\b[^>]*>/g)].map(([tag]) => Object.fromEntries(
  [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key.toLowerCase(), value.replaceAll('&amp;', '&')]),
)).filter(image => /previewImage|previewBackdrop/.test(image.class || ''));
const measurements = [];
async function measure(url) {
  const response = await fetch(new URL(url, origin), { headers: { Accept: 'image/webp' } });
  if (!response.ok) throw Error('Asset failed: ' + url);
  return { bytes: (await response.arrayBuffer()).byteLength, contentType: response.headers.get('content-type') };
}
for (const viewport of [390, 1440]) {
  const requests = new Map();
  for (const image of tags) {
    const selectedSize = image.sizes.split(', ').map(part => {
      const media = part.match(/^\(max-width: (\d+)px\) (.+)$/);
      return media ? (viewport <= Number(media[1]) ? media[2] : undefined) : part;
    }).find(Boolean);
    const cssWidth = selectedSize.startsWith('calc(') ? viewport - 96 : selectedSize.endsWith('vw') ? viewport * parseFloat(selectedSize) / 100 : parseFloat(selectedSize);
    const targetWidth = cssWidth * 2;
    const candidates = (image.srcset || '').split(', ').map(candidate => {
      const [url, width] = candidate.split(' '); return { url, width: parseInt(width) };
    });
    const candidate = candidates.find(candidate => candidate.width >= targetWidth) || candidates.at(-1);
    const url = candidate?.url || image.src;
    if (!requests.has(url)) requests.set(url, await measure(url));
  }
  measurements.push({ viewport, devicePixelRatio: 2, projectNetworkImageElements: tags.length, predictedUniqueRequests: requests.size, imageResponseBytes: [...requests.values()].reduce((sum, item) => sum + item.bytes, 0), requests: [...requests].map(([url, result]) => ({ url, ...result })) });
}
const smartFlood = { original: await measure('/projects/smartflood.png'), optimized640: await measure('/_next/image?url=%2Fprojects%2Fsmartflood.png&w=640&q=75') };
const report = {
  label, generatedAt: new Date().toISOString(), htmlBytes: Buffer.byteLength(html),
  method: 'HTTP response bytes for source-set candidates selected from server HTML at 390px and 1440px with DPR 2. Candidate selection models the existing sizes attributes. Not a browser network capture, visual check, or full-page transfer measurement.',
  measurements, smartFlood,
};
fs.mkdirSync('docs/qa', { recursive: true });
fs.writeFileSync(`docs/qa/images-${label}.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ label, measurements: measurements.map(({ requests: omitted, ...rest }) => ({ ...rest, measuredRequests: omitted.length })), smartFlood }, null, 2));
