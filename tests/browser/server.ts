import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { build, createServer } from 'vite';

// Exercise the engine's emitted module Worker/WASM, not only Vite's dev transform.
await build({
  configFile: false,
  base: '/sql-quest/engine-build/',
  build: {
    outDir: 'test-results/engine-build',
    emptyOutDir: false,
    rolldownOptions: { input: 'tests/browser/engine-harness.html' },
  },
});

const server = await createServer({
  base: '/sql-quest/',
  server: { host: '127.0.0.1', port: 4175, strictPort: true },
  plugins: [
    {
      name: 'stage-two-network-tests',
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          const path = request.url?.replace(/^\/sql-quest/u, '');
          if (path?.startsWith('/engine-build/')) {
            const relative = path.slice('/engine-build/'.length);
            if (
              !/^(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_.-]+\.(?:html|js|wasm)$/u.test(
                relative,
              )
            ) {
              response.writeHead(404);
              response.end();
              return;
            }
            void readFile(
              new URL(
                `../../test-results/engine-build/${relative}`,
                import.meta.url,
              ),
            ).then(
              (data) => {
                response.writeHead(200, {
                  'Content-Type': relative.endsWith('.wasm')
                    ? 'application/wasm'
                    : relative.endsWith('.js')
                      ? 'text/javascript'
                      : 'text/html',
                  'Content-Security-Policy':
                    "default-src 'none'; script-src 'self' 'wasm-unsafe-eval'; worker-src 'self'; connect-src 'self'",
                });
                response.end(data);
              },
              () => {
                response.writeHead(404);
                response.end();
              },
            );
          } else if (path === '/network-tests/gzip.json') {
            const body = gzipSync(JSON.stringify('a'.repeat(1024 * 1024)));
            response.writeHead(200, {
              'Content-Type': 'application/json',
              'Content-Encoding': 'gzip',
              'Content-Length': body.byteLength,
            });
            response.end(body);
          } else if (path === '/network-tests/redirect.json') {
            response.writeHead(302, {
              Location: '/sql-quest/content/course.json',
            });
            response.end();
          } else if (path?.startsWith('/api/sql-quest/')) {
            const relative = path.slice('/api/sql-quest/'.length);
            if (!/^(?:[a-z0-9_-]+\/)*[a-z0-9_-]+\.json$/u.test(relative)) {
              response.writeHead(404);
              response.end();
              return;
            }
            void readFile(
              new URL(`../../public/content/${relative}`, import.meta.url),
            ).then(
              (data) => {
                response.writeHead(200, {
                  'Content-Type': 'application/json',
                  'Cache-Control': 'no-cache',
                });
                response.end(data);
              },
              () => {
                response.writeHead(404);
                response.end();
              },
            );
          } else next();
        });
      },
    },
  ],
});
await server.listen();
