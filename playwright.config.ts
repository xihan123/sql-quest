import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  testMatch: '*.spec.ts',
  fullyParallel: false,
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:4175/sql-quest/', headless: true },
  webServer: {
    command: 'npm run content:build && node tests/browser/server.ts',
    url: 'http://127.0.0.1:4175/sql-quest/',
    reuseExistingServer: false,
  },
});
