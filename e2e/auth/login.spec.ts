import { expect, test } from '@playwright/test';

import { LoginPage } from '../pages/login.page';

const DEMO_EMAIL = 'demo@pelisplus.com';
const DEMO_PASSWORD = 'Demo1234!';

test.describe('Login — happy path', () => {
  test('should show dark cinema theme login form', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
    await expect(loginPage.registerLink).toBeVisible();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
  });

  test('should log in with demo credentials and redirect to catalog', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login(DEMO_EMAIL, DEMO_PASSWORD);
    await page.waitForURL('**/catalog', { timeout: 5000 });

    await expect(page).toHaveURL(/\/catalog/);
  });

  test('should toggle password visibility', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

    const showBtn = page.getByRole('button', { name: /mostrar contraseña/i });
    await showBtn.click();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');

    const hideBtn = page.getByRole('button', { name: /ocultar contraseña/i });
    await hideBtn.click();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });
});

test.describe('Login — error cases', () => {
  test('should show inline validation errors when submitting empty form', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.submitButton.click();

    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login('wrong@email.com', 'WrongPassword!');

    await expect(loginPage.formError).toBeVisible({ timeout: 3000 });
    await expect(loginPage.formError).toContainText(/credenciales/i);
  });

  test('should show email validation error for invalid format', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.emailInput.fill('notanemail');
    await loginPage.emailInput.blur();

    await expect(page.locator('#login-email-error')).toBeVisible();
  });

  test('should not clear field values on failed submission', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.emailInput.fill('wrong@email.com');
    await loginPage.passwordInput.fill('wrongpassword');
    await loginPage.submitButton.click();

    await loginPage.formError.waitFor({ timeout: 3000 });

    await expect(loginPage.emailInput).toHaveValue('wrong@email.com');
    await expect(loginPage.passwordInput).toHaveValue('wrongpassword');
  });
});
