import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Lock, Film, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-angular';

import { AuthService } from '../../core/services/auth.service';

interface ResetPasswordForm {
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const pwd = group.get('password')?.value as string;
  const confirm = group.get('confirmPassword')?.value as string;
  return pwd && confirm && pwd !== confirm ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-reset-password-page',
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
        @if (done()) {
          <div class="flex flex-col items-center gap-4 py-4 text-center">
            <div
              class="flex h-16 w-16 items-center justify-center rounded-full"
              style="background: rgba(34,197,94,.12);"
            >
              <lucide-icon [img]="CheckCircle" [size]="32" style="color: var(--color-success);" aria-hidden="true" />
            </div>
            <h1 class="text-2xl font-bold" style="color: var(--color-text-primary);">
              Contraseña actualizada
            </h1>
            <p class="text-sm" style="color: var(--color-text-secondary);">
              Tu contraseña se cambió correctamente. Ya puedes ingresar con tu nueva contraseña.
            </p>
            <a
              routerLink="/login"
              class="mt-4 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
              style="background: var(--color-accent); color: var(--color-text-inverse);"
            >
              Ir al inicio de sesión
            </a>
          </div>
        } @else if (!resetToken()) {
          <div class="flex flex-col items-center gap-4 py-4 text-center">
            <div
              class="flex h-16 w-16 items-center justify-center rounded-full"
              style="background: rgba(239,68,68,.12);"
            >
              <lucide-icon [img]="AlertCircle" [size]="32" style="color: var(--color-error);" aria-hidden="true" />
            </div>
            <h1 class="text-2xl font-bold" style="color: var(--color-text-primary);">
              Enlace inválido
            </h1>
            <p class="text-sm" style="color: var(--color-text-secondary);">
              Este enlace no es válido o ha expirado. Solicita un nuevo enlace de recuperación.
            </p>
            <a
              routerLink="/forgot-password"
              class="mt-4 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
              style="background: var(--color-accent); color: var(--color-text-inverse);"
            >
              Solicitar nuevo enlace
            </a>
          </div>
        } @else {
          <div class="mb-8 flex flex-col items-center gap-2 text-center">
            <div
              class="flex h-14 w-14 items-center justify-center rounded-2xl"
              style="background: var(--color-accent-muted);"
            >
              <lucide-icon [img]="Film" [size]="28" style="color: var(--color-accent);" aria-hidden="true" />
            </div>
            <h1 class="text-2xl font-bold" style="color: var(--color-text-primary);">
              Nueva contraseña
            </h1>
            <p class="text-sm" style="color: var(--color-text-secondary);">
              Elige una nueva contraseña para tu cuenta.
            </p>
          </div>

          <form [formGroup]="resetForm" (ngSubmit)="submit()" novalidate class="space-y-5">
            <div class="space-y-1.5">
              <label for="rp-password" class="block text-sm font-medium" style="color: var(--color-text-primary);">
                Nueva contraseña
              </label>
              <div class="relative">
                <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                  <lucide-icon [img]="Lock" [size]="16" style="color: var(--color-text-secondary);" aria-hidden="true" />
                </span>
                <input
                  id="rp-password"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  autocomplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  class="auth-input w-full rounded-xl py-3 pl-9 pr-10 text-sm"
                  [class.auth-input-error]="passwordCtrl.touched && passwordCtrl.invalid"
                  [attr.aria-invalid]="passwordCtrl.touched && passwordCtrl.invalid ? 'true' : null"
                />
                <button
                  type="button"
                  (click)="showPassword.update(v => !v)"
                  class="absolute right-3 top-1/2 -translate-y-1/2 p-0.5"
                  style="color: var(--color-text-secondary);"
                  [attr.aria-label]="showPassword() ? 'Ocultar' : 'Mostrar'"
                >
                  @if (showPassword()) {
                    <lucide-icon [img]="EyeOff" [size]="16" aria-hidden="true" />
                  } @else {
                    <lucide-icon [img]="Eye" [size]="16" aria-hidden="true" />
                  }
                </button>
              </div>
              @if (passwordCtrl.touched && passwordCtrl.hasError('minlength')) {
                <p class="flex items-center gap-1 text-xs" style="color: var(--color-error);" role="alert">
                  <lucide-icon [img]="AlertCircle" [size]="12" aria-hidden="true" />
                  La contraseña debe tener al menos 8 caracteres.
                </p>
              }
            </div>

            <div class="space-y-1.5">
              <label for="rp-confirm" class="block text-sm font-medium" style="color: var(--color-text-primary);">
                Confirmar contraseña
              </label>
              <div class="relative">
                <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                  <lucide-icon [img]="Lock" [size]="16" style="color: var(--color-text-secondary);" aria-hidden="true" />
                </span>
                <input
                  id="rp-confirm"
                  [type]="showConfirm() ? 'text' : 'password'"
                  formControlName="confirmPassword"
                  autocomplete="new-password"
                  placeholder="Repite tu contraseña"
                  class="auth-input w-full rounded-xl py-3 pl-9 pr-10 text-sm"
                  [class.auth-input-error]="confirmCtrl.touched && resetForm.hasError('passwordMismatch')"
                  [attr.aria-invalid]="confirmCtrl.touched && resetForm.hasError('passwordMismatch') ? 'true' : null"
                />
                <button
                  type="button"
                  (click)="showConfirm.update(v => !v)"
                  class="absolute right-3 top-1/2 -translate-y-1/2 p-0.5"
                  style="color: var(--color-text-secondary);"
                  [attr.aria-label]="showConfirm() ? 'Ocultar' : 'Mostrar'"
                >
                  @if (showConfirm()) {
                    <lucide-icon [img]="EyeOff" [size]="16" aria-hidden="true" />
                  } @else {
                    <lucide-icon [img]="Eye" [size]="16" aria-hidden="true" />
                  }
                </button>
              </div>
              @if (confirmCtrl.touched && resetForm.hasError('passwordMismatch')) {
                <p class="flex items-center gap-1 text-xs" style="color: var(--color-error);" role="alert">
                  <lucide-icon [img]="AlertCircle" [size]="12" aria-hidden="true" />
                  Las contraseñas no coinciden.
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
              {{ isSubmitting() ? 'Guardando...' : 'Cambiar contraseña' }}
            </button>
          </form>
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
export class ResetPasswordPageComponent {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly done = signal(false);
  readonly formError = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  readonly showPassword = signal(false);
  readonly showConfirm = signal(false);

  readonly resetToken = signal(
    (this.route.snapshot.queryParamMap.get('token') ?? '').trim() || null,
  );

  readonly Lock = Lock;
  readonly Film = Film;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly AlertCircle = AlertCircle;
  readonly CheckCircle = CheckCircle;

  readonly resetForm = new FormGroup<ResetPasswordForm>(
    {
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

  get passwordCtrl() { return this.resetForm.controls.password; }
  get confirmCtrl() { return this.resetForm.controls.confirmPassword; }

  submit(): void {
    if (this.isSubmitting()) return;

    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const token = this.resetToken();
    if (!token) return;

    this.formError.set(null);
    this.isSubmitting.set(true);
    const { password } = this.resetForm.getRawValue();

    this.authService.resetPassword(token, password).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.done.set(true);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.formError.set('No pudimos cambiar tu contraseña. El enlace puede haber expirado.');
      },
    });
  }
}
