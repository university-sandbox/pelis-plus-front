import { expect, test } from '@playwright/test';

import { RegisterPage } from '../pages/register.page';

test.describe('Register — happy path', () => {
  test('should show registration form with all fields', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    await expect(registerPage.nameInput).toBeVisible();
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.passwordInput).toBeVisible();
    await expect(registerPage.confirmPasswordInput).toBeVisible();
    await expect(registerPage.submitButton).toBeVisible();
    await expect(registerPage.loginLink).toBeVisible();
  });

  test('should register successfully and redirect to catalog', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    await registerPage.register(
      'Usuario Test',
      'newuser@pelisplus.com',
      'SecurePass123!',
    );

    await page.waitForURL('**/catalog', { timeout: 5000 });
    await expect(page).toHaveURL(/\/catalog/);
  });

  test('should show password strength indicator', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    await registerPage.passwordInput.fill('weak');
    await expect(registerPage.strengthIndicator).toBeVisible();

    await registerPage.passwordInput.fill('StrongPass1!');
    await expect(registerPage.strengthIndicator).toBeVisible();
    await expect(registerPage.strengthIndicator).toContainText(/muy fuerte/i);
  });
});

test.describe('Register — validation', () => {
  test('should show validation errors on empty submit', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    await registerPage.submitButton.click();
    await expect(page.getByRole('alert').first()).toBeVisible();
  });

  test('should show password mismatch error', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    await registerPage.nameInput.fill('Test User');
    await registerPage.emailInput.fill('test@email.com');
    await registerPage.passwordInput.fill('Password123!');
    await registerPage.confirmPasswordInput.fill('DifferentPassword!');
    await registerPage.submitButton.click();

    await expect(page.locator('#reg-confirm-error')).toBeVisible();
    await expect(page.locator('#reg-confirm-error')).toContainText(/no coinciden/i);
  });

  test('should show min-length error for short password', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    await registerPage.passwordInput.fill('short');
    await registerPage.passwordInput.blur();

    await expect(page.locator('#reg-password-error')).toBeVisible();
    await expect(page.locator('#reg-password-error')).toContainText(/8 caracteres/i);
  });

  test('link to login page should navigate correctly', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    await registerPage.loginLink.click();
    await expect(page).toHaveURL(/\/login/);
  });
});
