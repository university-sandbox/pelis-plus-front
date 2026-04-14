import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators, FormControl, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Mail, Film, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-angular';

import { AuthService } from '../../core/services/auth.service';

interface ForgotPasswordForm {
  email: FormControl<string>;
}

@Component({
  selector: 'app-forgot-password-page',
  imports: [ReactiveFormsModule, RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex min-h-dvh items-center justify-center px-4 py-12"
      style="background: var(--color-bg);"
    >
      <div
        class="w-full max-w-md rounded-2xl p-8 shadow-xl"
        style="background: var(--color-surface); border: 1px solid var(--color-border);"
      >
        @if (sent()) {
          <!-- Success state -->
          <div class="flex flex-col items-center gap-4 py-4 text-center">
            <div
              class="flex h-16 w-16 items-center justify-center rounded-full"
              style="background: rgba(34,197,94,.12);"
            >
              <lucide-icon [img]="CheckCircle" [size]="32" style="color: var(--color-success);" aria-hidden="true" />
            </div>
            <h1 class="text-2xl font-bold" style="color: var(--color-text-primary);">
              Correo enviado
            </h1>
            <p class="text-sm" style="color: var(--color-text-secondary);">
              Si el correo <strong>{{ submittedEmail() }}</strong> está registrado, recibirás un enlace para restablecer tu contraseña.
            </p>
            <a
              routerLink="/login"
              class="mt-4 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
              style="background: var(--color-accent); color: var(--color-text-inverse);"
            >
              <lucide-icon [img]="ArrowLeft" [size]="16" aria-hidden="true" />
              Volver al inicio de sesión
            </a>
          </div>
        } @else {
          <!-- Form state -->
          <div class="mb-8 flex flex-col items-center gap-2 text-center">
            <div
              class="flex h-14 w-14 items-center justify-center rounded-2xl"
              style="background: var(--color-accent-muted);"
            >
              <lucide-icon [img]="Film" [size]="28" style="color: var(--color-accent);" aria-hidden="true" />
            </div>
            <h1 class="text-2xl font-bold" style="color: var(--color-text-primary);">
              ¿Olvidaste tu contraseña?
            </h1>
            <p class="text-sm" style="color: var(--color-text-secondary);">
              Ingresa tu correo y te enviaremos un enlace para recuperarla.
            </p>
          </div>

          <form [formGroup]="forgotForm" (ngSubmit)="submit()" novalidate class="space-y-5">
            <div class="space-y-1.5">
              <label for="fp-email" class="block text-sm font-medium" style="color: var(--color-text-primary);">
                Correo electrónico
              </label>
              <div class="relative">
                <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                  <lucide-icon [img]="Mail" [size]="16" style="color: var(--color-text-secondary);" aria-hidden="true" />
                </span>
                <input
                  id="fp-email"
                  type="email"
                  formControlName="email"
                  autocomplete="email"
                  placeholder="tu@correo.com"
                  class="auth-input w-full rounded-xl py-3 pl-9 pr-4 text-sm"
                  [class.auth-input-error]="emailCtrl.touched && emailCtrl.invalid"
                  [attr.aria-describedby]="emailCtrl.touched && emailCtrl.invalid ? 'fp-email-error' : null"
                  [attr.aria-invalid]="emailCtrl.touched && emailCtrl.invalid ? 'true' : null"
                />
              </div>
              @if (emailCtrl.touched && emailCtrl.invalid) {
                <p id="fp-email-error" class="flex items-center gap-1 text-xs" style="color: var(--color-error);" role="alert">
                  <lucide-icon [img]="AlertCircle" [size]="12" aria-hidden="true" />
                  Ingresa un correo electrónico válido.
                </p>
              }
            </div>

            @if (formError()) {
              <div
                class="flex items-center gap-2 rounded-xl p-3 text-sm"
                style="background: rgba(239,68,68,.10); border: 1px solid rgba(239,68,68,.25); color: var(--color-error);"
                role="alert"
                aria-live="polite"
              >
                <lucide-icon [img]="AlertCircle" [size]="16" aria-hidden="true" />
                {{ formError() }}
              </div>
            }

            <button
              type="submit"
              [disabled]="isSubmitting()"
              class="auth-btn w-full rounded-full py-3 text-sm font-semibold transition-colors"
              style="background: var(--color-accent); color: var(--color-text-inverse);"
            >
              {{ isSubmitting() ? 'Enviando...' : 'Enviar enlace de recuperación' }}
            </button>
          </form>

          <p class="mt-6 text-center text-sm" style="color: var(--color-text-secondary);">
            <a routerLink="/login" class="flex items-center justify-center gap-1 font-semibold" style="color: var(--color-accent);">
              <lucide-icon [img]="ArrowLeft" [size]="14" aria-hidden="true" />
              Volver al inicio de sesión
            </a>
          </p>
        }
      </div>
    </div>
  `,
  styles: `
    .auth-input {
      background: var(--color-surface-raised);
      border: 1px solid var(--color-border-strong);
      color: var(--color-text-primary);
      transition: border-color 0.15s, box-shadow 0.15s;
      outline: none;
    }
    .auth-input::placeholder { color: var(--color-text-disabled); }
    .auth-input:focus { border-color: var(--color-accent); box-shadow: 0 0 0 2px var(--color-accent-muted); }
    .auth-input-error { border-color: var(--color-error) !important; }
    .auth-btn:hover:not(:disabled) { background: var(--color-accent-hover) !important; }
    .auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .auth-btn:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
  `,
})
export class ForgotPasswordPageComponent {
  private readonly authService = inject(AuthService);

  readonly sent = signal(false);
  readonly submittedEmail = signal('');
  readonly formError = signal<string | null>(null);
  readonly isSubmitting = signal(false);

  readonly Mail = Mail;
  readonly Film = Film;
  readonly AlertCircle = AlertCircle;
  readonly CheckCircle = CheckCircle;
  readonly ArrowLeft = ArrowLeft;

  readonly forgotForm = new FormGroup<ForgotPasswordForm>({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  get emailCtrl() { return this.forgotForm.controls.email; }

  submit(): void {
    if (this.isSubmitting()) return;

    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.formError.set(null);
    this.isSubmitting.set(true);
    const { email } = this.forgotForm.getRawValue();

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.submittedEmail.set(email);
        this.sent.set(true);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.formError.set('No pudimos procesar tu solicitud. Inténtalo de nuevo.');
      },
    });
  }
}
