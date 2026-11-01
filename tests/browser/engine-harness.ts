import { ExecutionClient } from '../../src/engine/client.ts';
import type {
  ExecutionOutcome,
  ExecutionState,
} from '../../src/engine/client.ts';

declare global {
  interface Window {
    engine: {
      run(request: unknown): Promise<ExecutionOutcome>;
      state(): ExecutionState;
      cancel(): void;
      generation(value: number | null): void;
      durations: number[];
      rawStart(): void;
      rawSend(value: unknown): void;
      rawMessages: unknown[];
      rawStop(): void;
    };
  }
}
let generation: number | null = 7;
const client = new ExecutionClient(() => generation);
let started = 0;
let raw: Worker | undefined;
window.engine = {
  run(request) {
    window.engine.durations.length = 0;
    return client.start(request);
  },
  state: client.getState,
  cancel: () => client.cancel(),
  generation(value) {
    generation = value;
  },
  durations: [],
  rawStart() {
    raw?.terminate();
    window.engine.rawMessages.length = 0;
    raw = new Worker(new URL('../../src/engine/worker.ts', import.meta.url), {
      type: 'module',
    });
    raw.onmessage = (event: MessageEvent<unknown>) =>
      window.engine.rawMessages.push(event.data);
    raw.onerror = (event) => {
      event.preventDefault();
      window.engine.rawMessages.push({ workerError: event.message });
    };
  },
  rawSend(value) {
    raw?.postMessage(value);
  },
  rawMessages: [],
  rawStop() {
    raw?.terminate();
    raw = undefined;
  },
};
client.subscribe(() => {
  const state = client.getState();
  if (state.status === 'preparing') started = 0;
  else {
    if (started) window.engine.durations.push(performance.now() - started);
    started = state.status === 'running' ? performance.now() : 0;
  }
});
