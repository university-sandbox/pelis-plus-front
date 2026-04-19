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
  templateUrl: './forgot-password-page.component.html',
  styleUrl: './forgot-password-page.component.scss',
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
