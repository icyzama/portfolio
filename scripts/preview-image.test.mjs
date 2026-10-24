import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import React, { act } from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { url: 'http://localhost/' });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createRoot } = await import('react-dom/client');
const imageResults = new Map();
const ImageStub = React.forwardRef(function ImageStub(props, ref) {
  const { src, fill: omittedFill, ...imageProps } = props;
  void omittedFill;
  const imageRef = React.useCallback(node => {
    if (node) {
      const result = imageResults.get(src) || 'pending';
      Object.defineProperty(node, 'complete', { configurable: true, value: result !== 'pending' });
      Object.defineProperty(node, 'naturalWidth', { configurable: true, value: result === 'cached' ? 640 : 0 });
    }
    if (typeof ref === 'function') ref(node);
  }, [ref, src]);
  return React.createElement('img', { ...imageProps, src, ref: imageRef });
});

const code = ts.transpileModule(fs.readFileSync('src/components/ui/preview-image.tsx', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText;
const previewModule = { exports: {} };
vm.runInNewContext(code, { module: previewModule, exports: previewModule.exports, require(id) {
  if (id === 'react') return React;
  if (id === 'react/jsx-runtime') return jsxRuntime;
  if (id === 'next/image') return ImageStub;
  if (id.endsWith('.module.css')) return { layer: 'layer', skeleton: 'skeleton', fallback: 'fallback' };
  throw Error('Unexpected module: ' + id);
} });
const { PreviewImage } = previewModule.exports;
const style = document.createElement('style');
style.textContent = fs.readFileSync('src/components/ui/preview-image.module.css', 'utf8');
document.head.append(style);

async function fixture(src) {
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  const render = async nextSrc => act(async () => root.render(React.createElement(PreviewImage, { src: nextSrc, alt: 'Project preview', fill: true, sizes: '300px' })));
  await render(src);
  return { host, render, async close() { await act(async () => root.unmount()); host.remove(); } };
}

test('pending image retains lazy loading and accessible alt with a decorative skeleton', async () => {
  const f = await fixture('/pending.png');
  try {
    assert.equal(f.host.querySelector('img').loading || f.host.querySelector('img').getAttribute('loading'), 'lazy');
    assert.equal(f.host.querySelector('img').alt, 'Project preview');
    assert.equal(f.host.querySelector('[aria-busy]').getAttribute('aria-busy'), 'true');
    const skeleton = f.host.querySelector('.skeleton');
    assert.equal(skeleton.getAttribute('aria-hidden'), 'true');
    assert.notEqual(window.getComputedStyle(skeleton).display, 'none');
  } finally { await f.close(); }
});

test('load event clears the skeleton immediately without a timer', async () => {
  const f = await fixture('/load.png');
  try {
    await act(async () => f.host.querySelector('img').dispatchEvent(new window.Event('load')));
    assert.equal(f.host.querySelector('[aria-busy]').getAttribute('aria-busy'), 'false');
    assert.equal(window.getComputedStyle(f.host.querySelector('.skeleton')).display, 'none');
    assert.equal(f.host.querySelector('[role="img"]'), null);
  } finally { await f.close(); }
});

test('cached image never waits for another load event', async () => {
  imageResults.set('/cached.png', 'cached');
  const f = await fixture('/cached.png');
  try {
    assert.equal(f.host.querySelector('[aria-busy]').getAttribute('aria-busy'), 'false');
    assert.equal(window.getComputedStyle(f.host.querySelector('.skeleton')).display, 'none');
  } finally { await f.close(); }
});

test('error ends loading and exposes a readable image fallback', async () => {
  const f = await fixture('/error.png');
  try {
    await act(async () => f.host.querySelector('img').dispatchEvent(new window.Event('error')));
    assert.equal(f.host.querySelector('[aria-busy]').getAttribute('aria-busy'), 'false');
    assert.equal(window.getComputedStyle(f.host.querySelector('.skeleton')).display, 'none');
    assert.equal(f.host.querySelector('img').getAttribute('aria-hidden'), 'true');
    assert.match(f.host.querySelector('[role="img"]').getAttribute('aria-label'), /Project preview/);
    assert.match(f.host.textContent, /Image unavailable/);
  } finally { await f.close(); }
});

test('cached failed image ends loading even when the error event occurred before hydration', async () => {
  imageResults.set('/already-failed.png', 'failed');
  const f = await fixture('/already-failed.png');
  try { assert.match(f.host.textContent, /Image unavailable/); }
  finally { await f.close(); }
});

test('changing the source starts a fresh lifecycle and can recover after failure', async () => {
  const f = await fixture('/first.png');
  try {
    await act(async () => f.host.querySelector('img').dispatchEvent(new window.Event('error')));
    await f.render('/replacement.png');
    assert.equal(f.host.querySelector('[aria-busy]').getAttribute('aria-busy'), 'true');
    assert.equal(f.host.querySelector('[role="img"]'), null);
    await act(async () => f.host.querySelector('img').dispatchEvent(new window.Event('load')));
    assert.equal(f.host.querySelector('[aria-busy]').getAttribute('aria-busy'), 'false');
  } finally { await f.close(); }
});

test('server HTML keeps the image visible without JavaScript or a loading overlay', () => {
  const html = renderToStaticMarkup(React.createElement(PreviewImage, { src: '/server.png', alt: 'Project preview', fill: true }));
  const host = document.createElement('div'); host.innerHTML = html; document.body.append(host);
  try {
    assert.equal(host.querySelector('img').alt, 'Project preview');
    assert.notEqual(window.getComputedStyle(host.querySelector('img')).visibility, 'hidden');
    assert.equal(window.getComputedStyle(host.querySelector('.skeleton')).display, 'none');
    assert.equal(host.querySelector('[aria-busy]').getAttribute('aria-busy'), 'false');
  } finally { host.remove(); }
});

test('experience tabs preserve native links, selection, keyboard navigation and focus', async () => {
  const navigations = [];
  const tabsModule = { exports: {} };
  const tabsCode = ts.transpileModule(fs.readFileSync('src/features/experiences/experience-tabs.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(tabsCode, { module: tabsModule, exports: tabsModule.exports, document, require(id) {
    if (id === 'react/jsx-runtime') return jsxRuntime;
    if (id === 'next/navigation') return { useRouter: () => ({ replace: (...args) => navigations.push(args) }) };
    if (id === 'next/link') return function LinkStub({ replace, scroll, ...props }) { void replace; void scroll; return React.createElement('a', props); };
    if (id.endsWith('.module.css')) return { tabs: 'tabs', tabNumber: 'tabNumber' };
    throw Error('Unexpected module: ' + id);
  } });
  const host = document.createElement('div'); document.body.append(host); const root = createRoot(host);
  try {
    await act(async () => root.render(React.createElement(tabsModule.exports.ExperienceTabs, { activeTab: 0 })));
    const links = [...host.querySelectorAll('[role="tab"]')];
    assert.deepEqual(links.map(link => link.getAttribute('href')), ['/experiences?tab=orgs', '/experiences?tab=hackathons', '/experiences?tab=internships']);
    assert.equal(links[0].getAttribute('aria-selected'), 'true');
    for (const [current, key, expected] of [[0, 'ArrowRight', 1], [1, 'End', 2], [2, 'Home', 0], [0, 'ArrowLeft', 2], [2, 'ArrowRight', 0]]) {
      await act(async () => links[current].dispatchEvent(new window.KeyboardEvent('keydown', { key, bubbles: true })));
      assert.equal(document.activeElement, links[expected]);
      assert.equal(navigations.at(-1)[0], links[expected].getAttribute('href'));
      assert.equal(navigations.at(-1)[1].scroll, false);
    }
    await act(async () => root.render(React.createElement(tabsModule.exports.ExperienceTabs, { activeTab: 2 })));
    assert.equal(host.querySelector('#experience-tab-2').getAttribute('aria-selected'), 'true');
    assert.equal(host.querySelector('#experience-tab-0').tabIndex, -1);
  } finally { await act(async () => root.unmount()); host.remove(); }
});
