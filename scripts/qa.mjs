import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import ts from 'typescript';
import * as crypto from 'node:crypto';
import { isIP } from 'node:net';
const origin = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
const results = [];
async function check(name, run) {
  try { const detail = await run(); results.push({ name, status: 'pass', detail }); }
  catch (error) { results.push({ name, status: 'fail', error: error.message }); }
}
const source = fs.readFileSync('src/app/api/contact/route.ts', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
const baseEnv = { RESEND_API_KEY: 'fake-qa-key', CONTACT_FROM_EMAIL: 'sender@example.com', CONTACT_TO_EMAIL: 'owner@example.com' };
function handler(options = {}) {
  const sent = []; const providerCalls = []; const logs = []; let clock = Date.now();
  const mod = { exports: {} };
  const sandbox = {
    module: mod, exports: mod.exports, Buffer, Response, AbortSignal, process: { env: { ...baseEnv, ...options.env } },
    Date: class extends Date { static now() { return clock; } },
    console: { info: (...args) => logs.push(args.join(' ')), error: (...args) => logs.push(args.join(' ')) },
    async fetch(url, init) {
      assert.equal(url, 'https://api.resend.com/emails');
      providerCalls.push({ url, init }); sent.push(JSON.parse(init.body));
      if (options.error) throw Error('simulated provider failure');
      if (options.providerFailure) return Response.json(options.providerFailure.body, { status: options.providerFailure.status });
      if (options.reject) return Response.json({ message: 'provider rejection' }, { status: 422 });
      if (options.noId) return Response.json({});
      return Response.json({ id: 'qa-email-id' });
    },
    require(id) {
      if (id === '@/content/portfolio') return { profile: { email: 'fallback@example.com' } };
      if (id === 'node:crypto') return crypto;
      if (id === 'node:net') return { isIP };
      if (id === '@/features/contact/contact-email') {
        const emailModule = { exports: {} };
        const emailCode = ts.transpileModule(fs.readFileSync('src/features/contact/contact-email.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
        vm.runInNewContext(emailCode, { module: emailModule, exports: emailModule.exports });
        return emailModule.exports;
      }
      throw Error('Unexpected module: ' + id);
    }
  };
  vm.runInNewContext(compiled, sandbox, { filename: 'contact-route.qa.cjs' });
  return { post: mod.exports.POST, sent, providerCalls, logs, advance(ms) { clock += ms; } };
}
const valid = { name: 'QA Visitor', email: 'visitor@example.com', topic: 'general', message: 'QA message; delivery is mocked.' };
function request(body = valid, headers = {}) {
  return new Request(origin + '/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '192.0.2.1', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });
}
async function expectStatus(body, expected, headers = {}, options = {}) {
  const h = handler(options); const response = await h.post(request(body, headers));
  assert.equal(response.status, expected); if (expected !== 200) assert.equal(h.sent.length, 0);
  return { status: response.status, sends: h.sent.length };
}
async function checkPages() {
  const routes = ['/', '/about', '/experiences', '/projects', '/blog', '/services', '/contact'];
  const assets = new Set(); const internal = new Set();
  for (const route of routes) await check('HTTP page ' + route, async () => {
    const response = await fetch(origin + route); assert.equal(response.status, 200);
    const html = await response.text(); assert.match(html, /<title>[^<]+<\/title>/); assert.match(html, /id="main-content"/);
    for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
      const value = match[1].replaceAll('&amp;', '&');
      if (!value.startsWith('/')) continue;
      if (value.startsWith('/_next/') || /\.(svg|png|jpg|ico)(?:\?|$)/.test(value)) assets.add(value);
      else internal.add(value);
    }
    return { title: html.match(/<title>([^<]+)<\/title>/)[1], bytes: Buffer.byteLength(html) };
  });
  for (const route of routes) await check('Server HTML primary heading ' + route, async () => {
    const html = await (await fetch(origin + route)).text();
    assert.match(html, /<h1[ >]/, 'No primary heading in server HTML; verify whether substantive content requires JavaScript.');
  });
  for (const [query, index] of [['', 0], ['?tab=orgs', 0], ['?tab=hackathons', 1], ['?tab=internships', 2], ['?tab=invalid', 0], ['?tab=internships&tab=orgs', 0]]) await check('Experiences server tab selection ' + (query || '(default)'), async () => {
    const html = await (await fetch(origin + '/experiences' + query)).text();
    const selected = html.match(new RegExp('<(?:button|a)[^>]*id="experience-tab-' + index + '"[^>]*>'))?.[0];
    assert.ok(selected?.includes('aria-selected="true"'), 'Expected selected tab in server HTML');
    assert.match(html, /LEARNING WITH COMMUNITY\./);
    assert.ok(!html.includes('BAILOUT_TO_CLIENT_SIDE_RENDERING'));
  });
  await check('Experiences heading is visible without client-side streaming scripts', async () => {
    const html = await (await fetch(origin + '/experiences')).text();
    const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
    const hidden = []; let headings = 0;
    for (const [tag] of markup.matchAll(/<div\b[^>]*>|<\/div>|<h1\b[^>]*>/g)) {
      if (tag.startsWith('</')) hidden.pop();
      else if (tag.startsWith('<div')) hidden.push(Boolean(hidden.at(-1)) || /\bhidden(?:[=\s>])/.test(tag));
      else { headings++; assert.ok(!hidden.at(-1), 'Primary heading is inside a hidden streamed container'); }
    }
    assert.equal(headings, 1);
  });
  await check('HTTP unknown route returns 404', async () => assert.equal((await fetch(origin + '/qa-missing-route')).status, 404));
  await check('HTTP GET contact endpoint returns 405', async () => assert.equal((await fetch(origin + '/api/contact')).status, 405));
  await check('HTTP malformed JSON rejected', async () => assert.equal((await fetch(origin + '/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' })).status, 400));
  await check('HTTP empty form rejected', async () => assert.equal((await fetch(origin + '/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })).status, 400));
  await check('HTTP cross-origin request rejected', async () => assert.equal((await fetch(origin + '/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://untrusted.example' }, body: '{}' })).status, 403));
  await check('Internal HTML links resolve', async () => {
    const checked = [];
    for (const link of internal) {
      const url = new URL(link, origin); url.hash = '';
      const res = await fetch(url); assert.equal(res.status, 200, link); checked.push(link);
    }
    return { count: checked.length, links: checked };
  });
  await check('Referenced local assets respond successfully', async () => {
    for (const asset of assets) { const res = await fetch(new URL(asset, origin)); assert.equal(res.status, 200, asset); await res.arrayBuffer(); }
    return { count: assets.size };
  });
}

(async () => {
  if (!process.argv.includes('--contact-only')) await checkPages();
  const invalid = [
    ['missing name', { name: '' }], ['blank message', { message: '   ' }], ['invalid email', { email: 'bad-email' }],
    ['unknown topic', { topic: 'unknown' }], ['long name', { name: 'a'.repeat(101) }], ['long organization', { organization: 'a'.repeat(121) }],
    ['long message', { message: 'a'.repeat(5001) }], ['header injection', { name: 'QA\r\nBcc: other@example.com' }],
    ['NUL in message', { message: 'hello\u0000world' }], ['non-project timeline', { timeline: 'asap' }], ['invalid project timeline', { topic: 'project', timeline: 'unknown' }],
    ['non-string email', { email: 42 }]
  ];
  for (const [name, fields] of invalid) await check('Contact rejects ' + name, () => expectStatus({ ...valid, ...fields }, 400));
  for (const body of [null, [], 42]) await check('Contact rejects payload ' + JSON.stringify(body), () => expectStatus(body, 400));
  await check('Contact rejects wrong media type', () => expectStatus(valid, 415, { 'Content-Type': 'text/plain' }));
  await check('Contact rejects oversized request', () => expectStatus('a'.repeat(32769), 413));
  await check('Contact honeypot returns success without sending', async () => { const h = handler(); assert.equal((await h.post(request({ ...valid, website: 'bot' }))).status, 200); assert.equal(h.sent.length, 0); });
  await check('Contact missing Resend key returns 503', () => expectStatus(valid, 503, {}, { env: { RESEND_API_KEY: '' } }));
  await check('Contact missing configured sender returns 503', () => expectStatus(valid, 503, {}, { env: { CONTACT_FROM_EMAIL: '' } }));
  await check('Contact valid message sends with controlled recipient and Reply-To', async () => {
    const h = handler(); const res = await h.post(request({ ...valid, to: 'attacker@example.com', from: 'attacker@example.com' }));
    assert.equal(res.status, 200); assert.equal(h.sent.length, 1); assert.deepEqual(JSON.parse(JSON.stringify(h.sent[0].to)), ['owner@example.com']); assert.equal(h.sent[0].from, "Reynald's Portfolio <sender@example.com>"); assert.equal(h.sent[0].reply_to, valid.email); assert.equal(res.headers.get('Cache-Control'), 'no-store');
    assert.equal(h.providerCalls[0].init.headers.Authorization, 'Bearer fake-qa-key');
    assert.equal(h.providerCalls[0].init.cache, 'no-store');
    assert.ok(h.providerCalls[0].init.signal instanceof AbortSignal);
    assert.match(h.sent[0].html, /QA Visitor/); assert.match(h.sent[0].text, /QA Visitor/);
  });
  await check('Contact optional project fields included', async () => {
    const h = handler(); assert.equal((await h.post(request({ ...valid, topic: 'project', organization: 'QA Org', timeline: 'asap' }))).status, 200); assert.match(h.sent[0].text, /QA Org/); assert.match(h.sent[0].text, /As soon as possible/);
  });
  for (const options of [{ error: true }, { reject: true }, { noId: true }]) await check('Contact provider failure ' + JSON.stringify(options), async () => { const h = handler(options); assert.equal((await h.post(request())).status, 502); });
  for (const [status, detail, reason] of [
    [403, 'You can only send testing emails to your own email address (owner@example.com).', 'test_recipient_not_allowed'],
    [403, 'The example.com domain is not verified.', 'sender_domain_not_verified'],
    [401, 'API key fake-qa-key is invalid', 'provider_authentication'],
    [429, 'Too many requests', 'provider_rate_limit'],
    [422, 'Invalid payload for owner@example.com', 'provider_rejection'],
  ]) await check('Contact diagnostics identify ' + reason + ' without leaking provider details', async () => {
    const h = handler({ providerFailure: { status, body: { name: 'validation_error', message: detail } } });
    assert.equal((await h.post(request())).status, 502);
    const log = h.logs.join('\n'); assert.ok(log.includes(reason)); assert.ok(log.includes(String(status)));
    assert.ok(!log.includes('owner@example.com')); assert.ok(!log.includes('fake-qa-key'));
  });
  await check('Contact HTML escapes visitor fields and preserves plain text and line breaks', async () => {
    const h = handler(); const message = '<img src=x onerror=alert(1)>\nSecond & final line';
    assert.equal((await h.post(request({ ...valid, name: 'QA <Visitor>', message }))).status, 200);
    const mail = h.sent[0]; assert.ok(mail.html.includes('QA &lt;Visitor&gt;')); assert.ok(!mail.html.includes('<img src=x'));
    assert.ok(mail.html.includes('&lt;img')); assert.ok(mail.html.includes('<br')); assert.ok(mail.html.includes('Second &amp; final line')); assert.ok(mail.text.includes(message));
  });
  await check('Contact sixth request is limited and expiry resets limit', async () => {
    const h = handler(); for (let i = 0; i < 5; i++) assert.equal((await h.post(request())).status, 200);
    const res = await h.post(request()); assert.equal(res.status, 429); assert.ok(Number(res.headers.get('Retry-After')) > 0); assert.equal(h.sent.length, 5);
    h.advance(15 * 60 * 1000 + 1); assert.equal((await h.post(request())).status, 200);
  });
  for (const topic of ['constructor', '__proto__', 'toString']) await check('Contact rejects inherited topic ' + topic, () => expectStatus({ ...valid, topic }, 400));
  await check('Contact rejects inherited timeline constructor', () => expectStatus({ ...valid, topic: 'project', timeline: 'constructor' }, 400));
  for (const topic of ['job', 'project', 'collaboration', 'general']) await check('Contact accepts supported topic ' + topic, () => expectStatus({ ...valid, topic }, 200));
  for (const timeline of ['', 'asap', 'within-month', 'one-to-three-months', 'flexible']) await check('Contact accepts project timeline ' + (timeline || '(empty)'), () => expectStatus({ ...valid, topic: 'project', timeline }, 200));
  await check('Changing untrusted forwarded headers cannot reset the rate limit', async () => {
    const h = handler(); for (let i = 0; i < 5; i++) await h.post(request());
    assert.equal((await h.post(request())).status, 429);
    assert.equal((await h.post(request(valid, { 'X-Forwarded-For': '192.0.2.2' })) ).status, 429);
  });
  await check('Vercel uses its protected address header, not ordinary forwarding headers', async () => {
    const h = handler({ env: { VERCEL: '1' } });
    for (let i = 0; i < 5; i++) assert.equal((await h.post(request(valid, { 'X-Vercel-Forwarded-For': '192.0.2.10' }))).status, 200);
    assert.equal((await h.post(request(valid, { 'X-Vercel-Forwarded-For': '192.0.2.10', 'X-Forwarded-For': '192.0.2.99' }))).status, 429);
    assert.equal((await h.post(request(valid, { 'X-Vercel-Forwarded-For': '192.0.2.11' }))).status, 200);
  });
  await check('Explicit trusted proxy header accepts a single IP and rejects address chains', async () => {
    const h = handler({ env: { CONTACT_TRUSTED_IP_HEADER: 'x-real-ip' } });
    for (let i = 0; i < 5; i++) assert.equal((await h.post(request(valid, { 'X-Real-IP': '2001:db8::1' }))).status, 200);
    assert.equal((await h.post(request(valid, { 'X-Real-IP': '2001:db8::1' }))).status, 429);
    assert.equal((await h.post(request(valid, { 'X-Real-IP': '2001:db8::2' }))).status, 200);
    for (let i = 0; i < 5; i++) assert.equal((await h.post(request(valid, { 'X-Real-IP': 'invalid' }))).status, 200);
    assert.equal((await h.post(request(valid, { 'X-Real-IP': '192.0.2.3, 192.0.2.4' }))).status, 429);
  });
  const report = { generatedAt: new Date().toISOString(), checks: results.length, passed: results.filter(r => r.status === 'pass').length, failed: results.filter(r => r.status === 'fail').length, results };
  fs.mkdirSync('.next', { recursive: true });
  fs.writeFileSync('.next/qa-results.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ checks: report.checks, passed: report.passed, failed: report.failed, failures: results.filter(r => r.status === 'fail'), evidence: '.next/qa-results.json' }, null, 2));
  process.exitCode = report.failed ? 1 : 0;
})().catch(error => { console.error(error); process.exitCode = 1; });
