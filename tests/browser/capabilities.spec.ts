import { expect, test } from '@playwright/test';

test('dependency gate: real prepare tail, authorizer, int64 and termination of busy WASM', async ({
  page,
}) => {
  await page.goto('tests/browser/harness.html');
  const probe = () =>
    page.evaluate(
      () =>
        new Promise<unknown>((resolve, reject) => {
          const worker = new Worker(
            new URL('./capabilities.worker.ts', location.href),
            { type: 'module' },
          );
          const timer = setTimeout(() => {
            worker.terminate();
            reject(new Error('probe timeout'));
          }, 15_000);
          worker.onmessage = (event: MessageEvent<unknown>) => {
            clearTimeout(timer);
            worker.terminate();
            resolve(event.data);
          };
          worker.onerror = (event) => {
            clearTimeout(timer);
            worker.terminate();
            reject(new Error(event.message));
          };
          worker.postMessage('probe');
        }),
    );
  const result = await probe();
  expect(result).toMatchObject({
    version: '3.54.1',
    int64: { rc: 0, integer: '9223372036854775807', rest: ' -- tail' },
    multiple: { rc: 0, rest: ' SELECT 2;' },
    allowed: { rc: 0, integer: '1' },
    count: { rc: 0, integer: '1' },
    hidden: { rc: 23 },
    write: { rc: 23 },
    pragma: { rc: 23 },
    function: { rc: 1 },
  });
  await page.evaluate(
    () =>
      new Promise<void>((resolve, reject) => {
        const worker = new Worker(
          new URL('./capabilities.worker.ts', location.href),
          { type: 'module' },
        );
        const timer = setTimeout(() => {
          worker.terminate();
          reject(new Error('busy probe timeout'));
        }, 15_000);
        worker.onmessage = (event: MessageEvent<unknown>) => {
          if (
            typeof event.data === 'object' &&
            event.data &&
            'busy' in event.data
          ) {
            setTimeout(() => {
              worker.terminate();
              clearTimeout(timer);
              resolve();
            }, 100);
          } else {
            worker.terminate();
            clearTimeout(timer);
            reject(new Error(JSON.stringify(event.data)));
          }
        };
        worker.postMessage('busy');
      }),
  );
  expect(await probe()).toEqual(result);
});
