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
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
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
