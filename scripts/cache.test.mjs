import test from 'node:test';
import assert from 'node:assert/strict';

const origin = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
test('unversioned public files require revalidation and use validators', async () => {
  for (const asset of ['/skills/react.svg', '/figma/home-iconusers.svg', '/projects/smartflood.png', '/experiences/aws-sug-ph-day-one-banner.jpg']) {
    const first = await fetch(origin + asset); const bytes = new Uint8Array(await first.arrayBuffer());
    assert.equal(first.status, 200); assert.ok(bytes.length > 0);
    assert.match(first.headers.get('cache-control'), /max-age=0/);
    assert.match(first.headers.get('cache-control'), /must-revalidate/);
    const etag = first.headers.get('etag'); assert.ok(etag);
    // Explicit mode prevents Node fetch injecting no-cache into a conditional request.
    // Node has no browser cache here; the server still receives the ETag and returns 304.
    const unchanged = await fetch(origin + asset, { cache: 'force-cache', headers: { 'If-None-Match': etag } });
    assert.equal(unchanged.status, 304);
    const stale = await fetch(origin + asset, { cache: 'force-cache', headers: { 'If-None-Match': '"an-obsolete-version"' } });
    assert.equal(stale.status, 200); assert.deepEqual(new Uint8Array(await stale.arrayBuffer()), bytes);
  }
});
test('content-hashed framework assets retain immutable caching', async () => {
  const html = await (await fetch(origin + '/projects')).text();
  const asset = html.match(/(?:src|href)="(\/_next\/static\/[^"?]+\.js)"/)?.[1]; assert.ok(asset);
  const response = await fetch(origin + asset); await response.arrayBuffer();
  assert.match(response.headers.get('cache-control'), /immutable/);
});
test('organization image variants use content-versioned URLs', async () => {
  const html = await (await fetch(origin + '/experiences')).text();
  const imageUrls = [...html.matchAll(/src="([^\"]*_next\/image[^\"]*)"/g)].map(([, value]) => value.replaceAll('&amp;', '&'));
  assert.ok(imageUrls.length > 0);
  for (const imageUrl of imageUrls) assert.match(new URL(imageUrl, origin).searchParams.get('url'), /^\/_next\/static\/media\/[^/]+\.[a-z\d_-]{6,}\.(?:png|jpg)$/i);
});
test('Experiences responses do not share cached selected-tab state', async () => {
  for (const [tab, index] of [['orgs', 0], ['internships', 2], ['hackathons', 1], ['orgs', 0]]) {
    const response = await fetch(origin + '/experiences?tab=' + tab); const html = await response.text();
    assert.match(response.headers.get('cache-control'), /no-store/);
    assert.match(html, new RegExp('id="experience-tab-' + index + '"[^>]+aria-selected="true"'));
  }
});
test('Contact POST responses remain uncached', async () => {
  const response = await fetch(origin + '/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
  assert.equal(response.status, 400); assert.match(response.headers.get('cache-control'), /no-store/);
});
