import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  computed,
  inject,
  signal,
  type ElementRef,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule, Validators, FormControl, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Film,
  Info,
  Lock,
  Mail,
  UserRound,
  X,
  LucideAngularModule,
} from 'lucide-angular';

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
  private readonly platformId = inject(PLATFORM_ID);

  readonly demoDialog = viewChild<ElementRef<HTMLElement>>('demoDialog');
  readonly demoAccounts = signal(parseDemoAccounts(environment.auth.demoEmail));
  readonly hasDemoAccounts = computed(() => this.demoAccounts().length > 0);
  readonly demoPassword = environment.auth.demoPassword;
  readonly mvpAccountsUnlock = environment.auth.mvpAccountsUnlock.trim();
  readonly hasMvpAccountsUnlock = computed(() => this.mvpAccountsUnlock.length > 0);
  readonly canShowDemoAccounts = computed(() => this.hasDemoAccounts() && this.hasMvpAccountsUnlock());
  readonly formError = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  readonly showPassword = signal(false);
  readonly showDemoAccounts = signal(false);
  readonly accountsUnlocked = signal(false);
  readonly showSaveUnlockChoice = signal(false);
  readonly unlockValue = signal('');
  readonly unlockError = signal<string | null>(null);
  readonly canSubmitUnlock = computed(() => this.unlockValue().trim().length > 0);

  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly Film = Film;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly AlertCircle = AlertCircle;
  readonly ArrowLeft = ArrowLeft;
  readonly Info = Info;
  readonly UserRound = UserRound;
  readonly X = X;

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

  get emailCtrl() {
    return this.loginForm.controls.email;
  }
  get passwordCtrl() {
    return this.loginForm.controls.password;
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  openDemoAccounts(): void {
    if (!this.canShowDemoAccounts()) return;

    this.unlockValue.set('');
    this.unlockError.set(null);
    this.showSaveUnlockChoice.set(false);
    this.accountsUnlocked.set(this.hasSavedMvpUnlock());
    this.showDemoAccounts.set(true);
    this.focusDemoDialog();
  }

  closeDemoAccounts(): void {
    this.showDemoAccounts.set(false);
    this.unlockValue.set('');
    this.unlockError.set(null);
    this.showSaveUnlockChoice.set(false);
    this.accountsUnlocked.set(false);
  }

  updateUnlockValue(event: Event): void {
    const input = event.target;
    this.unlockValue.set(input instanceof HTMLInputElement ? input.value : '');
    this.unlockError.set(null);
  }

  unlockDemoAccounts(): void {
    if (!this.canSubmitUnlock()) return;

    if (this.unlockValue().trim() !== this.mvpAccountsUnlock) {
      this.unlockError.set('Código incorrecto. Verifica el acceso MVP.');
      return;
    }

    this.unlockError.set(null);
    this.showSaveUnlockChoice.set(true);
  }

  saveMvpUnlock(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(MVP_ACCOUNTS_UNLOCK_STORAGE_KEY, this.mvpAccountsUnlock);
    }
    this.showSaveUnlockChoice.set(false);
    this.accountsUnlocked.set(true);
  }

  continueWithoutSavingUnlock(): void {
    this.showSaveUnlockChoice.set(false);
    this.accountsUnlocked.set(true);
  }

  private hasSavedMvpUnlock(): boolean {
    return hasStoredMvpUnlock(this.platformId, this.mvpAccountsUnlock);
  }

  private focusDemoDialog(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    setTimeout(() => this.demoDialog()?.nativeElement.focus());
  }

  useDemoAccount(email: string): void {
    this.loginForm.patchValue({
      email,
      password: this.demoPassword,
    });
    this.loginForm.markAsPristine();
    this.loginForm.markAsUntouched();
    this.formError.set(null);
    this.closeDemoAccounts();
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
        const nextRoute = this.authService.isAdmin() ? '/admin' : environment.app.postLoginRoute;
        void this.router.navigateByUrl(nextRoute);
      },
      error: (error: unknown) => {
        this.isSubmitting.set(false);

        const is401 =
          (error instanceof HttpErrorResponse && error.status === 401) ||
          (typeof error === 'object' &&
            error !== null &&
            (error as { status?: number }).status === 401);

        if (is401) {
          this.formError.set('Credenciales incorrectas. Verifica tu correo y contraseña.');
          return;
        }

        this.formError.set('No podemos conectarnos ahora. Inténtalo en un momento.');
      },
    });
  }
}

function parseDemoAccounts(value: string): readonly string[] {
  return value
    .split(';')
    .map((email) => email.trim())
    .filter((email) => email.length > 0);
}

const MVP_ACCOUNTS_UNLOCK_STORAGE_KEY = 'pelisplus_mvp_accounts_unlock';

function hasStoredMvpUnlock(platformId: object, expectedValue: string): boolean {
  if (!isPlatformBrowser(platformId)) {
    return false;
  }

  return localStorage.getItem(MVP_ACCOUNTS_UNLOCK_STORAGE_KEY) === expectedValue;
}
