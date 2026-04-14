import { type Locator, type Page } from '@playwright/test';

import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly formError: Locator;
  readonly registerLink: Locator;
  readonly forgotPasswordLink: Locator;
  readonly showPasswordButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('#login-email');
    this.passwordInput = page.locator('#login-password');
    this.submitButton = page.getByRole('button', { name: /ingresar/i });
    this.formError = page.locator('[role="alert"][aria-live="polite"]');
    this.registerLink = page.getByRole('link', { name: /regístrate/i });
    this.forgotPasswordLink = page.getByRole('link', { name: /olvidaste/i });
    this.showPasswordButton = page.getByRole('button', { name: /mostrar contraseña/i });
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
