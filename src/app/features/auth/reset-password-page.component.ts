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
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.scss',
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
