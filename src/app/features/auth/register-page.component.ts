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
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
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
