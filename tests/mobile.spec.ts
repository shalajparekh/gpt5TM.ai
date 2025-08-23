import { test, expect } from '@playwright/test';

test.describe('Mobile compatibility', () => {
  test('Home loads and mobile nav works', async ({ page }) => {
    await page.goto('/');
    // Navbar hamburger visible
    const hamburger = page.getByRole('button', { name: /open menu/i });
    await expect(hamburger).toBeVisible();
    await hamburger.click();
    // Scope to the mobile menu panel to avoid footer/header duplicates
    const menu = page.locator('div.md\\:hidden.border-t');
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('link', { name: 'Services', exact: true })).toBeVisible();
    await expect(menu.getByRole('link', { name: 'Testimonials', exact: true })).toBeVisible();
    await expect(menu.getByRole('link', { name: 'Contact', exact: true })).toBeVisible();
  });

  test('Pricing -> navbar anchors route to landing sections', async ({ page }) => {
    await page.goto('/pricing');
    // Open mobile menu
    await page.getByRole('button', { name: /open menu/i }).click();
    const menu = page.locator('div.md\\:hidden.border-t');
    await expect(menu).toBeVisible();
    await menu.getByRole('link', { name: 'Services', exact: true }).click();
    await page.waitForURL(/\/#services$/);
    await expect(page.locator('#services')).toBeVisible();

    // Go back to pricing and test testimonials
    await page.goto('/pricing');
    await page.getByRole('button', { name: /open menu/i }).click();
    await expect(menu).toBeVisible();
    await menu.getByRole('link', { name: 'Testimonials', exact: true }).click();
    await page.waitForURL(/\/#testimonials$/);
    await expect(page.locator('#testimonials')).toBeVisible();

    // Contact + Get proposal CTA
    await page.goto('/pricing');
    await page.getByRole('button', { name: /open menu/i }).click();
    await expect(menu).toBeVisible();
    await menu.getByRole('link', { name: 'Contact', exact: true }).click();
    await page.waitForURL(/\/#contact$/);
    await expect(page.locator('#contact')).toBeVisible();

    await page.goto('/pricing');
    await page.getByRole('button', { name: /open menu/i }).click();
    await expect(menu).toBeVisible();
    await menu.getByRole('link', { name: /get proposal/i }).click();
    await page.waitForURL(/\/#contact$/);
    await expect(page.locator('#contact')).toBeVisible();
  });
});


