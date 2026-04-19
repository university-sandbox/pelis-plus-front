import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators, FormControl, FormGroup } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { LucideAngularModule, Mail, Lock, User, Film, Eye, EyeOff, AlertCircle, Check, ArrowLeft } from 'lucide-angular';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';

interface RegisterForm {
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const pwd = group.get('password')?.value as string;
  const confirm = group.get('confirmPassword')?.value as string;
  return pwd && confirm && pwd !== confirm ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-register-page',
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
        <!-- Back to login -->
        <a
          routerLink="/login"
          class="back-btn mb-6 flex w-fit items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium transition-colors"
          style="color: var(--color-text-secondary);"
          aria-label="Volver al inicio de sesión"
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
            Crea tu cuenta
          </h1>
          <p class="text-sm" style="color: var(--color-text-secondary);">
            Regístrate para reservar entradas y más
          </p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="submit()" novalidate class="space-y-5">

          <!-- Full name -->
          <div class="space-y-1.5">
            <label for="reg-name" class="block text-sm font-medium" style="color: var(--color-text-primary);">
              Nombre completo
            </label>
            <div class="relative">
              <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <lucide-icon [img]="User" [size]="16" style="color: var(--color-text-secondary);" aria-hidden="true" />
              </span>
              <input
                id="reg-name"
                type="text"
                formControlName="name"
                autocomplete="name"
                placeholder="Tu nombre"
                class="auth-input w-full rounded-xl py-3 pl-9 pr-4 text-sm"
                [class.auth-input-error]="nameCtrl.touched && nameCtrl.invalid"
                [attr.aria-describedby]="nameCtrl.touched && nameCtrl.invalid ? 'reg-name-error' : null"
                [attr.aria-invalid]="nameCtrl.touched && nameCtrl.invalid ? 'true' : null"
              />
            </div>
            @if (nameCtrl.touched && nameCtrl.hasError('required')) {
              <p id="reg-name-error" class="flex items-center gap-1 text-xs" style="color: var(--color-error);" role="alert">
                <lucide-icon [img]="AlertCircle" [size]="12" aria-hidden="true" />
                El nombre es obligatorio.
              </p>
            } @else if (nameCtrl.touched && nameCtrl.hasError('minlength')) {
              <p id="reg-name-error" class="flex items-center gap-1 text-xs" style="color: var(--color-error);" role="alert">
                <lucide-icon [img]="AlertCircle" [size]="12" aria-hidden="true" />
                El nombre debe tener al menos 2 caracteres.
              </p>
            }
          </div>

          <!-- Email -->
          <div class="space-y-1.5">
            <label for="reg-email" class="block text-sm font-medium" style="color: var(--color-text-primary);">
              Correo electrónico
            </label>
            <div class="relative">
              <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <lucide-icon [img]="Mail" [size]="16" style="color: var(--color-text-secondary);" aria-hidden="true" />
              </span>
              <input
                id="reg-email"
                type="email"
                formControlName="email"
                autocomplete="email"
                placeholder="tu@correo.com"
                class="auth-input w-full rounded-xl py-3 pl-9 pr-4 text-sm"
                [class.auth-input-error]="emailCtrl.touched && emailCtrl.invalid"
                [attr.aria-describedby]="emailCtrl.touched && emailCtrl.invalid ? 'reg-email-error' : null"
                [attr.aria-invalid]="emailCtrl.touched && emailCtrl.invalid ? 'true' : null"
              />
            </div>
            @if (emailCtrl.touched && emailCtrl.invalid) {
              <p id="reg-email-error" class="flex items-center gap-1 text-xs" style="color: var(--color-error);" role="alert">
                <lucide-icon [img]="AlertCircle" [size]="12" aria-hidden="true" />
                Ingresa un correo electrónico válido.
              </p>
            }
          </div>

          <!-- Password -->
          <div class="space-y-1.5">
            <label for="reg-password" class="block text-sm font-medium" style="color: var(--color-text-primary);">
              Contraseña
            </label>
            <div class="relative">
              <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <lucide-icon [img]="Lock" [size]="16" style="color: var(--color-text-secondary);" aria-hidden="true" />
              </span>
              <input
                id="reg-password"
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                autocomplete="new-password"
                placeholder="Mínimo 8 caracteres"
                class="auth-input w-full rounded-xl py-3 pl-9 pr-10 text-sm"
                [class.auth-input-error]="passwordCtrl.touched && passwordCtrl.invalid"
                [attr.aria-describedby]="'reg-pwd-strength' + (passwordCtrl.touched && passwordCtrl.invalid ? ' reg-password-error' : '')"
                [attr.aria-invalid]="passwordCtrl.touched && passwordCtrl.invalid ? 'true' : null"
              />
              <button
                type="button"
                (click)="showPassword.update(v => !v)"
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

            <!-- Strength indicator -->
            @if (passwordCtrl.value) {
              <div id="reg-pwd-strength" class="space-y-1" aria-live="polite">
                <div class="flex gap-1">
                  @for (segment of [0,1,2,3]; track segment) {
                    <div
                      class="h-1 flex-1 rounded-full transition-colors"
                      [style.background]="segment < passwordStrength() ? strengthColor() : 'var(--color-border-strong)'"
                    ></div>
                  }
                </div>
                <p class="text-xs" [style.color]="strengthColor()">{{ strengthLabel() }}</p>
              </div>
            }

            @if (passwordCtrl.touched && passwordCtrl.hasError('required')) {
              <p id="reg-password-error" class="flex items-center gap-1 text-xs" style="color: var(--color-error);" role="alert">
                <lucide-icon [img]="AlertCircle" [size]="12" aria-hidden="true" />
                La contraseña es obligatoria.
              </p>
            } @else if (passwordCtrl.touched && passwordCtrl.hasError('minlength')) {
              <p id="reg-password-error" class="flex items-center gap-1 text-xs" style="color: var(--color-error);" role="alert">
                <lucide-icon [img]="AlertCircle" [size]="12" aria-hidden="true" />
                La contraseña debe tener al menos 8 caracteres.
              </p>
            }
          </div>

          <!-- Confirm password -->
          <div class="space-y-1.5">
            <label for="reg-confirm" class="block text-sm font-medium" style="color: var(--color-text-primary);">
              Confirmar contraseña
            </label>
            <div class="relative">
              <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <lucide-icon [img]="Lock" [size]="16" style="color: var(--color-text-secondary);" aria-hidden="true" />
              </span>
              <input
                id="reg-confirm"
                [type]="showConfirm() ? 'text' : 'password'"
                formControlName="confirmPassword"
                autocomplete="new-password"
                placeholder="Repite tu contraseña"
                class="auth-input w-full rounded-xl py-3 pl-9 pr-10 text-sm"
                [class.auth-input-error]="confirmCtrl.touched && (confirmCtrl.invalid || registerForm.hasError('passwordMismatch'))"
                [attr.aria-describedby]="confirmCtrl.touched && registerForm.hasError('passwordMismatch') ? 'reg-confirm-error' : null"
                [attr.aria-invalid]="confirmCtrl.touched && registerForm.hasError('passwordMismatch') ? 'true' : null"
              />
              <button
                type="button"
                (click)="showConfirm.update(v => !v)"
                class="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 transition-colors"
                style="color: var(--color-text-secondary);"
                [attr.aria-label]="showConfirm() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              >
                @if (showConfirm()) {
                  <lucide-icon [img]="EyeOff" [size]="16" aria-hidden="true" />
                } @else {
                  <lucide-icon [img]="Eye" [size]="16" aria-hidden="true" />
                }
              </button>
            </div>
            @if (confirmCtrl.touched && registerForm.hasError('passwordMismatch')) {
              <p id="reg-confirm-error" class="flex items-center gap-1 text-xs" style="color: var(--color-error);" role="alert">
                <lucide-icon [img]="AlertCircle" [size]="12" aria-hidden="true" />
                Las contraseñas no coinciden.
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
            {{ isSubmitting() ? 'Creando cuenta...' : 'Crear cuenta' }}
          </button>
        </form>

        <p class="mt-6 text-center text-sm" style="color: var(--color-text-secondary);">
          ¿Ya tienes cuenta?
          <a routerLink="/login" class="font-semibold" style="color: var(--color-accent);">
            Ingresar
          </a>
        </p>
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
    .auth-input:focus {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 2px var(--color-accent-muted);
    }
    .auth-input-error { border-color: var(--color-error) !important; }
    .auth-input-error:focus { box-shadow: 0 0 0 2px rgba(239,68,68,.15) !important; }
    .auth-btn:hover:not(:disabled) { background: var(--color-accent-hover) !important; }
    .auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .auth-btn:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
    .back-btn:hover { background: var(--color-surface-raised); color: var(--color-text-primary) !important; }
    .back-btn:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
  `,
})
export class RegisterPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly formError = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  readonly showPassword = signal(false);
  readonly showConfirm = signal(false);

  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly User = User;
  readonly Film = Film;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly AlertCircle = AlertCircle;
  readonly Check = Check;
  readonly ArrowLeft = ArrowLeft;

  readonly registerForm = new FormGroup<RegisterForm>(
    {
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8)],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: passwordMatchValidator },
  );

  get nameCtrl() { return this.registerForm.controls.name; }
  get emailCtrl() { return this.registerForm.controls.email; }
  get passwordCtrl() { return this.registerForm.controls.password; }
  get confirmCtrl() { return this.registerForm.controls.confirmPassword; }

  readonly passwordStrength = computed(() => {
    const pwd = this.passwordCtrl.value;
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  });

  readonly strengthLabel = computed(() => {
    const s = this.passwordStrength();
    if (s <= 1) return 'Débil';
    if (s === 2) return 'Regular';
    if (s === 3) return 'Buena';
    return 'Muy fuerte';
  });

  readonly strengthColor = computed(() => {
    const s = this.passwordStrength();
    if (s <= 1) return 'var(--color-error)';
    if (s === 2) return 'var(--color-warning)';
    if (s === 3) return 'var(--color-info)';
    return 'var(--color-success)';
  });

  submit(): void {
    if (this.isSubmitting()) return;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.formError.set(null);
    this.isSubmitting.set(true);

    const { name, email, password } = this.registerForm.getRawValue();
    this.authService.register(name, email, password).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        void this.router.navigateByUrl(environment.app.postLoginRoute);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.formError.set('No pudimos crear tu cuenta. Inténtalo de nuevo.');
      },
    });
  }
}
