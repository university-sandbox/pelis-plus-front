import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule, Validators, FormControl, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { LucideAngularModule, Mail, Lock, Film, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-angular';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex min-h-dvh items-center justify-center px-4 py-12"
      style="background: var(--color-bg);"
    >
      <!-- Card -->
      <div
        class="w-full max-w-md rounded-2xl p-8 shadow-xl"
        style="background: var(--color-surface); border: 1px solid var(--color-border);"
      >
        <!-- Back to catalog -->
        <a
          routerLink="/"
          class="back-btn mb-6 flex w-fit items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium transition-colors"
          style="color: var(--color-text-secondary);"
          aria-label="Volver al catálogo"
        >
          <lucide-icon [img]="ArrowLeft" [size]="16" aria-hidden="true" />
          Volver
        </a>

        <!-- Logo -->
        <div class="mb-8 flex flex-col items-center gap-2 text-center">
          <div
            class="flex h-14 w-14 items-center justify-center rounded-2xl"
            style="background: var(--color-accent-muted);"
          >
            <lucide-icon [img]="Film" [size]="28" style="color: var(--color-accent);" aria-hidden="true" />
          </div>
          <h1 class="text-2xl font-bold" style="color: var(--color-text-primary);">
            Bienvenido de vuelta
          </h1>
          <p class="text-sm" style="color: var(--color-text-secondary);">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <!-- Form -->
        <form [formGroup]="loginForm" (ngSubmit)="submit()" novalidate class="space-y-5">

          <!-- Email -->
          <div class="space-y-1.5">
            <label
              for="login-email"
              class="block text-sm font-medium"
              style="color: var(--color-text-primary);"
            >
              Correo electrónico
            </label>
            <div class="relative">
              <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <lucide-icon [img]="Mail" [size]="16" style="color: var(--color-text-secondary);" aria-hidden="true" />
              </span>
              <input
                id="login-email"
                type="email"
                formControlName="email"
                autocomplete="email"
                placeholder="tu@correo.com"
                class="auth-input w-full rounded-xl py-3 pl-9 pr-4 text-sm"
                [class.auth-input-error]="emailCtrl.touched && emailCtrl.invalid"
                [attr.aria-describedby]="emailCtrl.touched && emailCtrl.invalid ? 'login-email-error' : null"
                [attr.aria-invalid]="emailCtrl.touched && emailCtrl.invalid ? 'true' : null"
              />
            </div>
            @if (emailCtrl.touched && emailCtrl.invalid) {
              <p id="login-email-error" class="flex items-center gap-1 text-xs" style="color: var(--color-error);" role="alert">
                <lucide-icon [img]="AlertCircle" [size]="12" aria-hidden="true" />
                Ingresa un correo electrónico válido.
              </p>
            }
          </div>

          <!-- Password -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label
                for="login-password"
                class="block text-sm font-medium"
                style="color: var(--color-text-primary);"
              >
                Contraseña
              </label>
              <a
                routerLink="/forgot-password"
                class="text-xs font-medium transition-colors"
                style="color: var(--color-accent);"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <div class="relative">
              <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <lucide-icon [img]="Lock" [size]="16" style="color: var(--color-text-secondary);" aria-hidden="true" />
              </span>
              <input
                id="login-password"
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                autocomplete="current-password"
                placeholder="••••••••"
                class="auth-input w-full rounded-xl py-3 pl-9 pr-10 text-sm"
                [class.auth-input-error]="passwordCtrl.touched && passwordCtrl.invalid"
                [attr.aria-describedby]="passwordCtrl.touched && passwordCtrl.invalid ? 'login-password-error' : null"
                [attr.aria-invalid]="passwordCtrl.touched && passwordCtrl.invalid ? 'true' : null"
              />
              <button
                type="button"
                (click)="togglePassword()"
                class="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 transition-colors"
                style="color: var(--color-text-secondary);"
                [attr.aria-label]="showPassword() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              >
                @if (showPassword()) {
                  <lucide-icon [img]="EyeOff" [size]="16" aria-hidden="true" />
                } @else {
                  <lucide-icon [img]="Eye" [size]="16" aria-hidden="true" />
                }
              </button>
            </div>
            @if (passwordCtrl.touched && passwordCtrl.invalid) {
              <p id="login-password-error" class="flex items-center gap-1 text-xs" style="color: var(--color-error);" role="alert">
                <lucide-icon [img]="AlertCircle" [size]="12" aria-hidden="true" />
                La contraseña debe tener al menos 4 caracteres.
              </p>
            }
          </div>

          <!-- Global error -->
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

          <!-- Submit -->
          <button
            type="submit"
            [disabled]="isSubmitting()"
            class="auth-btn w-full rounded-full py-3 text-sm font-semibold transition-colors"
            style="background: var(--color-accent); color: var(--color-text-inverse);"
          >
            {{ isSubmitting() ? 'Ingresando...' : 'Ingresar' }}
          </button>
        </form>

        <!-- Register link -->
        <p class="mt-6 text-center text-sm" style="color: var(--color-text-secondary);">
          ¿No tienes cuenta?
          <a
            routerLink="/register"
            class="font-semibold transition-colors"
            style="color: var(--color-accent);"
          >
            Regístrate gratis
          </a>
        </p>

        <!-- Demo hint -->
        @if (demoEmail) {
          <p class="mt-4 text-center text-xs" style="color: var(--color-text-disabled);" aria-live="polite">
            Demo: <span class="font-medium" style="color: var(--color-text-secondary);">{{ demoEmail }}</span>
            / <span class="font-medium" style="color: var(--color-text-secondary);">{{ demoPassword }}</span>
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

    .auth-input::placeholder {
      color: var(--color-text-disabled);
    }

    .auth-input:focus {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 2px var(--color-accent-muted);
    }

    .auth-input-error {
      border-color: var(--color-error) !important;
    }

    .auth-input-error:focus {
      box-shadow: 0 0 0 2px rgba(239,68,68,.15) !important;
    }

    .auth-btn:hover:not(:disabled) {
      background: var(--color-accent-hover) !important;
    }

    .auth-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .auth-btn:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 2px;
    }

    .back-btn:hover {
      background: var(--color-surface-raised);
      color: var(--color-text-primary) !important;
    }

    .back-btn:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 2px;
    }
  `,
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly demoEmail = environment.auth.demoEmail;
  readonly demoPassword = environment.auth.demoPassword;
  readonly formError = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  readonly showPassword = signal(false);

  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly Film = Film;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly AlertCircle = AlertCircle;
  readonly ArrowLeft = ArrowLeft;

  readonly loginForm = new FormGroup<LoginForm>({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4)],
    }),
  });

  get emailCtrl() { return this.loginForm.controls.email; }
  get passwordCtrl() { return this.loginForm.controls.password; }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  submit(): void {
    if (this.isSubmitting()) return;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.formError.set(null);
    this.isSubmitting.set(true);

    const { email, password } = this.loginForm.getRawValue();
    this.authService.login(email, password).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        void this.router.navigateByUrl(environment.app.postLoginRoute);
      },
      error: (error: unknown) => {
        this.isSubmitting.set(false);

        const is401 =
          (error instanceof HttpErrorResponse && error.status === 401) ||
          (typeof error === 'object' && error !== null && (error as { status?: number }).status === 401);

        if (is401) {
          this.formError.set('Credenciales incorrectas. Verifica tu correo y contraseña.');
          return;
        }

        this.formError.set('No podemos conectarnos ahora. Inténtalo en un momento.');
      },
    });
  }
}
