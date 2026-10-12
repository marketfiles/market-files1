import { test, expect, type Page } from '@playwright/test';

/**
 * Market Files smoke tests: structure and "nothing catastrophic", not visuals.
 * Live data (prices, headlines, photos, TradingView) may be missing in CI — that is fine.
 */

// Only fail on uncaught errors thrown by our own code, not by third-party widgets.
function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => {
    const where = `${e.message}\n${e.stack || ''}`;
    if (/\/experience\/|\/_next\//.test(where) || !/https?:\/\//.test(where)) errors.push(e.message);
  });
  return errors;
}
// Returning visitor, so the first-visit welcome note doesn't cover anything.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try { localStorage.setItem('mf_visit', JSON.stringify({ first: Date.now(), last: Date.now(), visits: 2, px: {} })); } catch {}
  });
});

test('homepage loads with navigation, globe and biggest-stories band', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/');
  await expect(page).toHaveTitle(/Market Files/);
  await expect(page.locator('#nav-links a')).not.toHaveCount(0);
  for (const label of ['Markets', 'Global', 'Crypto', 'Companies', 'History']) {
    await expect(page.locator('#nav-links a', { hasText: label }).first()).toBeAttached();
  }
  await expect(page.locator('canvas#globe')).toBeVisible();
  await expect(page.locator('#tb')).toBeAttached();
  await expect(page.locator('#j-heat')).toBeAttached();
  expect(errors, errors.join('\n')).toEqual([]);
});

const SECTIONS: [string, string][] = [
  ['#/markets', '.fr-t'],
  ['#/global-finance', '.fr-t'],
  ['#/crypto', '.fr-t'],
  ['#/companies', '#co-tbl'],
  ['#/history', '.fr-t'],
  ['#/dashboard', '#dash'],
  ['#/tools', '.calc'],
  ['#/newsletter', 'input[type="email"]'],
];
for (const [hash, selector] of SECTIONS) {
  test(`section ${hash} opens`, async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto('/' + hash);
    await expect(page.locator(selector).first()).toBeAttached({ timeout: 15_000 });
    expect(errors, errors.join('\n')).toEqual([]);
  });
}

test('server-rendered pages respond', async ({ request }) => {
  for (const path of ['/files', '/files/black-monday-1987', '/day/1987-10-19', '/blog', '/sitemap.xml', '/robots.txt']) {
    const r = await request.get(path);
    expect(r.status(), path).toBe(200);
  }
});

test('API routes respond with JSON', async ({ request }) => {
  // External feeds may be unreachable in CI; we only require a well-formed answer.
  for (const path of ['/api/quotes', '/api/news', '/api/top', '/api/country?iso=JP', '/api/tm']) {
    const r = await request.get(path, { timeout: 40_000 });
    expect(r.status(), path).toBeLessThan(500);
    const body = await r.json().catch(() => null);
    expect(body, `${path} returned JSON`).not.toBeNull();
  }
});
