import type {
  Course,
  Fixture,
  Lesson,
} from '../contracts/generated/types.d.ts';
import { ContentError, freeze, limits } from './checks.ts';
import type { DeepReadonly } from './checks.ts';
import { fetchJson } from './http.ts';
import { validateContent, validateCourse } from './semantics.ts';
import {
  registeredPaths,
  resolveContentUrl,
  resolveRootUrl,
  validateAddresses,
} from './urls.ts';

export interface ContentSnapshot {
  readonly contentToken: string;
  readonly rootUrl: string;
  readonly course: DeepReadonly<Course>;
  readonly lessons: readonly DeepReadonly<Lesson>[];
  readonly fixtures: readonly DeepReadonly<Fixture>[];
}
type Phase = 'root' | 'content' | 'validation';
export type LoadState =
  | { status: 'idle' | 'cancelled' }
  | { status: 'loading'; phase: Phase }
  | { status: 'error'; phase: Phase; message: string }
  | { status: 'ready'; snapshot: ContentSnapshot };

export class ContentLoader {
  private state: LoadState = { status: 'idle' };
  private listeners = new Set<() => void>();
  private active: AbortController | undefined;
  private generation = 0;
  private disposed = false;

  constructor(
    rootAddress: string,
    appBaseUrl: string,
    fetcher: typeof fetch = fetch,
  ) {
    this.rootAddress = rootAddress;
    this.appBaseUrl = appBaseUrl;
    this.fetcher = fetcher;
  }
  private readonly rootAddress: string;
  private readonly appBaseUrl: string;
  private readonly fetcher: typeof fetch;

  getState = (): LoadState => this.state;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  private publish(state: LoadState) {
    this.state = Object.freeze(state);
    for (const listener of this.listeners) listener();
  }
  cancel() {
    this.generation++;
    this.active?.abort(new ContentError('内容加载已取消'));
    this.active = undefined;
    if (!this.disposed) this.publish({ status: 'cancelled' });
  }
  dispose() {
    this.cancel();
    this.disposed = true;
    this.listeners.clear();
  }

  async load(): Promise<void> {
    // A successful session stays pinned; there is no background refresh.
    if (this.disposed || this.state.status === 'ready') return;
    this.active?.abort(new ContentError('已开始新的内容加载'));
    const generation = ++this.generation;
    const controller = new AbortController();
    this.active = controller;
    const deadline = performance.now() + limits.loadMs;
    const timer = setTimeout(
      () => controller.abort(new ContentError('完整内容加载超过 60 秒')),
      limits.loadMs,
    );
    let phase: Phase = 'root';
    const check = () => {
      controller.signal.throwIfAborted();
      if (generation !== this.generation || this.disposed)
        throw new ContentError('内容加载已失效');
      if (performance.now() > deadline)
        throw new ContentError('完整内容加载超过 60 秒');
    };
    try {
      this.publish({ status: 'loading', phase });
      const root = resolveRootUrl(this.rootAddress, this.appBaseUrl);
      const budget = { used: 0 };
      const course = validateCourse(
        await fetchJson(
          root,
          limits.documentBytes,
          budget,
          controller.signal,
          this.fetcher,
        ),
      );
      check();
      validateAddresses(course, root);
      phase = 'content';
      this.publish({ status: 'loading', phase });
      const paths = registeredPaths(course);
      const fixturePaths = new Set(
        course.fixtures.map((fixture) => fixture.path),
      );
      const documents = new Map<string, unknown>();
      let next = 0;
      await Promise.all(
        Array.from(
          { length: Math.min(limits.concurrency, paths.length) },
          async () => {
            while (next < paths.length) {
              check();
              const path = paths[next++];
              if (path === undefined) throw new ContentError('内容索引无效');
              const body = await fetchJson(
                resolveContentUrl(path, root),
                fixturePaths.has(path)
                  ? limits.fixtureBytes
                  : limits.documentBytes,
                budget,
                controller.signal,
                this.fetcher,
              );
              check();
              documents.set(path, body);
            }
          },
        ),
      );
      check();
      phase = 'validation';
      this.publish({ status: 'loading', phase });
      const content = validateContent(course, documents);
      check();
      const snapshot: ContentSnapshot = freeze({
        ...content,
        rootUrl: root.href,
        contentToken: crypto.randomUUID(),
      });
      check();
      this.publish({ status: 'ready', snapshot });
    } catch (error) {
      controller.abort(error);
      if (generation === this.generation && !this.disposed)
        this.publish({
          status: 'error',
          phase,
          message:
            error instanceof ContentError
              ? error.message
              : '内容读取、UTF-8 解码或 JSON 解析失败',
        });
    } finally {
      clearTimeout(timer);
      if (this.active === controller) this.active = undefined;
    }
  }
}
