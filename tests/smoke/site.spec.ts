import { test, expect } from '@playwright/test';

const experienceRoutes = [
  ['Markets', '/#/markets'],
  ['Global', '/#/global-finance'],
  ['Crypto', '/#/crypto'],
  ['Companies', '/#/companies'],
  ['History', '/#/history'],
  ['Dashboard', '/#/dashboard'],
  ['Tools', '/#/tools'],
] as const;

test('homepage renders the Market Files shell', async ({ page }) => {
  const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBeLessThan(500);
  await expect(page.locator('body')).toContainText(/Market Files/i);
  await expect(page.locator('body')).toContainText(/Markets|Money|History/i);
});

for (const [name, route] of experienceRoutes) {
  test(`${name} route opens without a server error`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBeLessThan(500);
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('body')).toContainText(/Market Files/i);
  });
}

test('server-rendered public routes respond', async ({ page }) => {
  for (const route of ['/files', '/blog', '/sitemap.xml', '/robots.txt']) {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response?.status(), route).toBeLessThan(500);
  }
});
