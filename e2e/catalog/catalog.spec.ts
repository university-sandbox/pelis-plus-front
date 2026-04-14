import { expect, test } from '@playwright/test';

import { LoginPage } from '../pages/login.page';
import { CatalogPage } from '../pages/catalog.page';

const DEMO_EMAIL = 'demo@pelisplus.com';
const DEMO_PASSWORD = 'Demo1234!';

test.describe('Catalog — happy path', () => {
  test.beforeEach(async ({ page }) => {
    // Log in first since catalog is protected
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(DEMO_EMAIL, DEMO_PASSWORD);
    await page.waitForURL('**/catalog', { timeout: 5000 });
  });

  test('should show navbar with app logo', async ({ page }) => {
    await expect(page.locator('app-navbar')).toBeVisible();
    await expect(page.getByRole('link', { name: /pelis/i })).toBeVisible();
  });

  test('should show hero banner section', async ({ page }) => {
    const catalogPage = new CatalogPage(page);
    await expect(catalogPage.heroSection).toBeVisible();
  });

  test('should show genre filter pills', async ({ page }) => {
    const catalogPage = new CatalogPage(page);
    await expect(catalogPage.genrePills).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('option', { name: 'Todos' })).toBeVisible();
  });

  test('should show skeleton loaders while content loads', async ({ page }) => {
    await page.goto('/catalog');
    // Skeletons should appear immediately before data loads
    const skeletons = page.locator('app-skeleton-loader');
    await expect(skeletons.first()).toBeVisible();
  });

  test('should display movie sections', async ({ page }) => {
    const catalogPage = new CatalogPage(page);
    await expect(catalogPage.nowPlayingSection).toBeVisible({ timeout: 10000 });
    await expect(catalogPage.upcomingSection).toBeVisible({ timeout: 10000 });
    await expect(catalogPage.popularSection).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Catalog — search', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(DEMO_EMAIL, DEMO_PASSWORD);
    await page.waitForURL('**/catalog', { timeout: 5000 });
  });

  test('should show search results when typing', async ({ page }) => {
    const catalogPage = new CatalogPage(page);
    await catalogPage.search('Avengers');

    // Sections should be replaced by search results section
    const searchResultsSection = page.getByRole('region', { name: /resultados de búsqueda/i });
    await expect(searchResultsSection).toBeVisible({ timeout: 5000 });
  });

  test('should show empty state for no results', async ({ page }) => {
    const catalogPage = new CatalogPage(page);
    await catalogPage.search('xyzquerywithnoresults12345');

    const emptyState = page.locator('app-empty-state');
    await expect(emptyState).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Catalog — auth guard', () => {
  test('unauthenticated user should be redirected to login', async ({ page }) => {
    await page.goto('/catalog');
    await expect(page).toHaveURL(/\/login/);
  });
});
