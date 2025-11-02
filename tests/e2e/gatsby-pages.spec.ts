import { test, expect } from '@playwright/test';

const BASE = (process.env.TEST_URL || 'http://localhost:8000').replace(/\/$/, '');

const KEY_PAGES: string[] = [
  '/',
  '/page-2/',
  '/using-typescript/',
  '/using-ssr/',
  '/using-dsg/',
];

test.describe('Gatsby Starter Default - Key Pages', () => {
  test('home page renders correctly with no console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto(BASE, { waitUntil: 'networkidle' });

    // Check key elements
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();

    // No console errors
    expect(consoleErrors, 'No console errors on home page').toHaveLength(0);
  });

  test('all key pages load without errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    for (const path of KEY_PAGES) {
      const url = `${BASE}${path}`;
      const response = await page.goto(url, { waitUntil: 'networkidle' });

      // Check HTTP status
      expect(response?.status(), `${path} should return 200`).toBe(200);

      // Check page has content
      const mainContent = page.locator('main');
      await expect(mainContent, `${path} should have main content`).toBeVisible();
    }

    // No console errors across all pages
    expect(consoleErrors, 'No console errors expected on any page').toHaveLength(0);
  });

  test('navigation works correctly', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });

    // Find and click "Go to page 2" link
    const page2Link = page.getByRole('link', { name: /page 2/i });
    await expect(page2Link).toBeVisible();
    await page2Link.click();

    // Wait for navigation
    await page.waitForURL('**/page-2/**');

    // Verify we're on page 2
    await expect(page.locator('h1')).toContainText(/page two/i);

    // Go back
    await page.goBack();
    await expect(page).toHaveURL(BASE);
  });
});
