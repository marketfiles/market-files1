import { defineConfig, devices } from '@playwright/test';

// Structural smoke tests against a production build (`next start`).
// Deliberately NOT pixel-perfect: prices, headlines, photos, widgets and the globe are live.
export default defineConfig({
  testDir: './tests/smoke',
  timeout: 45_000,
  retries: process.env.CI ? 1 : 0,
  // 'github' adds each failed test as an annotation on the check run, so failures are readable without downloading the report.
  reporter: process.env.CI ? [['list'], ['github'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: 'http://127.0.0.1:3000', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'phone', use: { ...devices['Pixel 7'] } },
  ],
  webServer: { command: 'npm run start -- -p 3000', url: 'http://127.0.0.1:3000/robots.txt', timeout: 120_000, reuseExistingServer: !process.env.CI },
});
