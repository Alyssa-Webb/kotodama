/** Mounts one art component alone for `npm run art:sheet`. Served by Vite in dev only; never in the app build. */
/// <reference types="vite/client" />
import { createElement, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import { installTheme } from '../../src/foundations/theme/theme';
import '../../src/app/global.css';

declare global {
  interface Window {
    artReady?: boolean;
    artError?: string;
  }
}

async function mount(): Promise<void> {
  const params = new URLSearchParams(location.search);
  installTheme();
  const width = params.get('width');
  if (width) document.getElementById('art-root')!.style.width = `${width}px`;
  document.documentElement.setAttribute('data-theme', params.get('theme') ?? 'light');
  for (const css of params.getAll('css')) await import(/* @vite-ignore */ css);
  const loaded = (await import(/* @vite-ignore */ params.get('module') ?? '')) as Record<
    string,
    ComponentType<Record<string, unknown>>
  >;
  const name = params.get('export') ?? 'default';
  const component = loaded[name];
  if (!component) throw new Error(`${params.get('module')} has no export named ${name}`);
  // Each prop is name=value. The value is JSON when it parses, such as true or 3, and otherwise a string.
  const props: Record<string, unknown> = {};
  for (const prop of params.getAll('prop')) {
    const split = prop.indexOf('=');
    const value = prop.slice(split + 1);
    try {
      props[prop.slice(0, split)] = JSON.parse(value);
    } catch {
      props[prop.slice(0, split)] = value;
    }
  }
  createRoot(document.getElementById('art-root')!).render(createElement(component, props));
  window.artReady = true;
}

mount().catch((error: unknown) => {
  window.artError = String(error);
});
