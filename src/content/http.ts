import { ContentError, limits, requireContent } from './checks.ts';

export interface ByteBudget {
  used: number;
}

function abortable<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    const abort = () => reject(signal.reason);
    signal.addEventListener('abort', abort, { once: true });
    promise
      .then(resolve, reject)
      .finally(() => signal.removeEventListener('abort', abort));
    if (signal.aborted) abort();
  });
}

export async function fetchJson(
  url: URL,
  maxBytes: number,
  budget: ByteBudget,
  parent: AbortSignal,
  fetcher: typeof fetch = fetch,
): Promise<unknown> {
  const controller = new AbortController();
  const signal = AbortSignal.any([parent, controller.signal]);
  const deadline = performance.now() + limits.requestMs;
  const timer = setTimeout(
    () => controller.abort(new ContentError('内容请求或正文读取超过 10 秒')),
    limits.requestMs,
  );
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  let complete = false;
  try {
    signal.throwIfAborted();
    const response = await abortable(
      fetcher(url.href, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        credentials: 'omit',
        redirect: 'error',
        cache: 'no-cache',
        signal,
      }),
      signal,
    );
    requireContent(
      !response.redirected && (!response.url || response.url === url.href),
      '内容响应发生重定向',
    );
    requireContent(
      response.status === 200,
      `内容 HTTP 状态错误：${response.status}`,
    );
    const mime =
      response.headers
        .get('Content-Type')
        ?.split(';')[0]
        ?.trim()
        .toLowerCase() ?? '';
    requireContent(
      /^application\/(?:json|[a-z0-9!#$&^_.+-]+\+json)$/u.test(mime),
      '内容响应不是 JSON 媒体类型',
    );
    requireContent(response.body, '内容响应缺少正文');
    reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const chunk = await abortable(reader.read(), signal);
      signal.throwIfAborted();
      requireContent(
        performance.now() <= deadline,
        '内容请求或正文读取超过 10 秒',
      );
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      budget.used += chunk.value.byteLength;
      requireContent(
        bytes <= maxBytes && budget.used <= limits.totalBytes,
        '内容正文超过字节预算',
      );
      chunks.push(chunk.value);
    }
    complete = true;
    const data = new Uint8Array(bytes);
    let offset = 0;
    for (const chunk of chunks) {
      data.set(chunk, offset);
      offset += chunk.byteLength;
    }
    const parsed: unknown = JSON.parse(
      new TextDecoder('utf-8', { fatal: true }).decode(data),
    );
    signal.throwIfAborted();
    requireContent(performance.now() <= deadline, '内容请求超过 10 秒');
    return parsed;
  } finally {
    clearTimeout(timer);
    if (!complete) {
      controller.abort();
      // Cancellation can reject if the transport already failed; preserve that first error.
      if (reader) void reader.cancel().catch(() => undefined);
    }
    reader?.releaseLock();
  }
}
