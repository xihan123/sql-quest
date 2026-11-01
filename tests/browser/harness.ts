import { ContentLoader } from '../../src/content/loader.ts';
import type { LoadState } from '../../src/content/loader.ts';
import { fetchJson } from '../../src/content/http.ts';
import { limits } from '../../src/content/checks.ts';

declare global {
  interface Window {
    stageTwo: {
      fixture(fixture: unknown, queries: string[]): Promise<unknown>;
      load(root: string): Promise<LoadState>;
      network(path: string): Promise<string>;
    };
  }
}

window.stageTwo = {
  fixture(fixture, queries) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(
        new URL('./fixture.worker.ts', import.meta.url),
        { type: 'module' },
      );
      const cleanup = () => {
        clearTimeout(timer);
        worker.terminate();
      };
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error('WASM audit timed out'));
      }, 15_000);
      worker.onmessage = (event: MessageEvent<unknown>) => {
        cleanup();
        resolve(event.data);
      };
      worker.onerror = (event) => {
        cleanup();
        reject(new Error(event.message));
      };
      worker.postMessage({ fixture, queries });
    });
  },
  async load(root) {
    const loader = new ContentLoader(
      root,
      new URL('/sql-quest/', location.href).href,
    );
    await loader.load();
    const state = loader.getState();
    loader.dispose();
    return state;
  },
  async network(path) {
    try {
      await fetchJson(
        new URL(path, location.href),
        limits.documentBytes,
        { used: 0 },
        new AbortController().signal,
      );
      return 'unexpected success';
    } catch (error) {
      return error instanceof Error ? error.message : 'failure';
    }
  },
};
