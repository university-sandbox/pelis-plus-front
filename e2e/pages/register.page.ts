import { type Locator, type Page } from '@playwright/test';

import { BasePage } from './base.page';

export class RegisterPage extends BasePage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly formError: Locator;
  readonly loginLink: Locator;
  readonly strengthIndicator: Locator;

  constructor(page: Page) {
    super(page);
    this.nameInput = page.locator('#reg-name');
    this.emailInput = page.locator('#reg-email');
    this.passwordInput = page.locator('#reg-password');
    this.confirmPasswordInput = page.locator('#reg-confirm');
    this.submitButton = page.getByRole('button', { name: /crear cuenta/i });
    this.formError = page.locator('[role="alert"][aria-live="polite"]');
    this.loginLink = page.getByRole('link', { name: /ingresar/i });
    this.strengthIndicator = page.locator('#reg-pwd-strength');
  }

  async goto(): Promise<void> {
    await this.page.goto('/register');
  }

  async register(name: string, email: string, password: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.submitButton.click();
  }
}
