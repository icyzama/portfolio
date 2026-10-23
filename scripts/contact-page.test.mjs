import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import React, { act } from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
globalThis.window = dom.window; globalThis.document = dom.window.document;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createRoot } = await import('react-dom/client');
// jsdom has no native dialog top-layer implementation; model open/close and focus only.
window.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); (this.querySelector('button') || this).focus(); };
window.HTMLDialogElement.prototype.close = function () { if (this.open) { this.removeAttribute('open'); this.dispatchEvent(new window.Event('close')); } };

function component(fetchMock) {
  const contactModule = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync('src/features/contact/contact-page.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(code, { module: contactModule, exports: contactModule.exports, FormData: window.FormData, AbortSignal, fetch: fetchMock, require(id) {
    if (id === 'react') return React;
    if (id === 'react/jsx-runtime') return jsxRuntime;
    if (id === '@/content/profile') return { profile: { email: 'owner@example.com', github: '#github', linkedin: '#linkedin' } };
    if (id === '@/components/ui/design') return { Asset: () => null };
    if (id === '@/components/ui/title-panel') return { TitlePanel: ({ children }) => React.createElement('section', null, children) };
    if (id === '@/components/ui/editorial') return { EditorialHero: () => React.createElement('h1', null, 'Contact') };
    if (id.endsWith('.module.css')) return { dialog: 'dialog', icon: 'icon', email: 'email', surface: 'surface', spinner: 'spinner' };
    throw Error('Unexpected module: ' + id);
  } });
  return contactModule.exports.ContactPage;
}
async function fixture() {
  let resolve, reject; const calls = [];
  const delivery = new Promise((yes, no) => { resolve = yes; reject = no; });
  const ContactPage = component((...args) => { calls.push(args); return delivery; });
  const host = document.createElement('div'); document.body.append(host); const root = createRoot(host);
  await act(async () => root.render(React.createElement(ContactPage)));
  const form = host.querySelector('form');
  form.elements.name.value = 'QA Visitor'; form.elements.email.value = 'visitor@example.com'; form.elements.message.value = 'Please preserve this draft.';
  await act(async () => { form.elements.topic.value = 'general'; form.elements.topic.dispatchEvent(new window.Event('change', { bubbles: true })); });
  return {
    host, form, calls, resolve, reject,
    submit: () => act(async () => { form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true })); }),
    async close() { await act(async () => root.unmount()); host.remove(); },
  };
}
const progress = host => host.querySelector('[aria-labelledby="contact-sending-title"]');
const success = host => host.querySelector('[aria-labelledby="contact-success-title"]');

test('pending submission opens the sending modal and prevents duplicate requests', async () => {
  const f = await fixture();
  try {
    await f.submit();
    assert.equal(progress(f.host)?.open, true);
    assert.match(progress(f.host).textContent, /SENDING MESSAGE/);
    assert.equal(f.form.querySelector('[type="submit"]').disabled, true);
    await f.submit(); assert.equal(f.calls.length, 1);
    assert.equal(success(f.host).open, false);
    await act(async () => f.resolve(Response.json({ message: 'Accepted' })));
  } finally { await f.close(); }
});

test('accepted submission replaces sending with success and clears the form', async () => {
  const f = await fixture();
  try {
    await f.submit(); await act(async () => f.resolve(Response.json({ message: 'Accepted' })));
    assert.equal(progress(f.host)?.open, false);
    assert.equal(success(f.host).open, true);
    assert.match(success(f.host).textContent, /visitor@example.com/);
    assert.equal(f.form.elements.message.value, '');
    assert.equal(f.form.querySelector('[type="submit"]').disabled, false);
    await act(async () => success(f.host).querySelector('button').click());
    assert.equal(document.activeElement, f.form.querySelector('[type="submit"]'));
  } finally { await f.close(); }
});

test('server rejection closes sending, preserves the draft and restores form focus', async () => {
  const f = await fixture();
  try {
    await f.submit(); await act(async () => f.resolve(Response.json({ message: 'Please try again later.' }, { status: 502 })));
    assert.equal(progress(f.host)?.open, false); assert.equal(success(f.host).open, false);
    assert.equal(f.form.elements.message.value, 'Please preserve this draft.');
    assert.match(f.host.querySelector('[role="alert"]').textContent, /Please try again later/);
    assert.equal(f.form.querySelector('[type="submit"]').disabled, false);
    assert.equal(document.activeElement, f.form.querySelector('[type="submit"]'));
  } finally { await f.close(); }
});

test('network failure closes sending and preserves the draft', async () => {
  const f = await fixture();
  try {
    await f.submit(); await act(async () => f.reject(new TypeError('Network unavailable')));
    assert.equal(progress(f.host)?.open, false); assert.equal(success(f.host).open, false);
    assert.equal(f.form.elements.message.value, 'Please preserve this draft.');
    assert.match(f.host.querySelector('[role="alert"]').textContent, /Could not connect/);
  } finally { await f.close(); }
});
