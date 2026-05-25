import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CreditCard,
  Crown,
  ShieldCheck,
  Zap,
  type LucideIconData,
  LucideAngularModule,
} from 'lucide-angular';

import { MembershipService } from '../../core/services/membership.service';
import { type MembershipSubscriptionResponse } from '../../core/services/membership.service';
import { type MembershipPlan } from '../../core/models/membership.model';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';

type MembershipCheckoutStep = 'plans' | 'review' | 'payment-ready';

interface MembershipCheckoutStepItem {
  id: MembershipCheckoutStep;
  label: string;
}

@Component({
  selector: 'app-memberships-page',
  imports: [LucideAngularModule, NavbarComponent, SkeletonLoaderComponent, ErrorStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './memberships-page.component.html',
})
export class MembershipsPageComponent implements OnInit {
  private readonly membershipService = inject(MembershipService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly plans = signal<MembershipPlan[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly checkoutStep = signal<MembershipCheckoutStep>('plans');
  readonly selectedPlan = signal<MembershipPlan | null>(null);
  readonly preparingPayment = signal(false);
  readonly paymentSession = signal<MembershipSubscriptionResponse | null>(null);
  readonly paymentError = signal<string | null>(null);
  readonly checkoutSteps: readonly MembershipCheckoutStepItem[] = [
    { id: 'plans', label: 'Elige tu plan' },
    { id: 'review', label: 'Revisa tu compra' },
    { id: 'payment-ready', label: 'Listo para pagar' },
  ];
  readonly selectedPlanBenefits = computed(() => this.selectedPlan()?.benefits ?? []);
  readonly estimatedSavings = computed(() => {
    const plan = this.selectedPlan();

    if (!plan) {
      return 0;
    }

    return Number((plan.ticketsPerMonth * 24 * (plan.discountPercentage / 100)).toFixed(2));
  });

  readonly Crown = Crown;
  readonly Check = Check;
  readonly Zap = Zap;
  readonly ArrowLeft = ArrowLeft;
  readonly CreditCard = CreditCard;
  readonly ShieldCheck = ShieldCheck;
  readonly AlertCircle = AlertCircle;

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('payment') === 'cancelled') {
      this.paymentError.set('El pago de la membresía fue cancelado. Puedes intentarlo nuevamente cuando quieras.');
    }

    this.loadPlans();
  }

  loadPlans(): void {
    this.loading.set(true);
    this.error.set(false);
    this.membershipService.getPlans().subscribe({
      next: (p) => { this.plans.set(p); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  choosePlan(plan: MembershipPlan): void {
    if (!this.authService.isClient()) {
      void this.router.navigate(['/login']);
      return;
    }

    this.selectedPlan.set(plan);
    this.paymentSession.set(null);
    this.paymentError.set(null);
    this.checkoutStep.set('review');
  }

  backToPlans(): void {
    this.checkoutStep.set('plans');
    this.selectedPlan.set(null);
    this.paymentSession.set(null);
    this.paymentError.set(null);
    this.preparingPayment.set(false);
  }

  preparePayment(): void {
    const plan = this.selectedPlan();

    if (!plan || this.preparingPayment()) {
      return;
    }

    this.preparingPayment.set(true);
    this.paymentError.set(null);

    this.membershipService.subscribe(plan.id).subscribe({
      next: (session) => {
        this.paymentSession.set(session);
        this.preparingPayment.set(false);
        this.checkoutStep.set('payment-ready');
        if (session.checkoutUrl) {
          window.location.assign(session.checkoutUrl);
          return;
        }

        this.paymentError.set('Stripe no devolvió una URL de checkout para esta membresía.');
      },
      error: (error: unknown) => {
        this.preparingPayment.set(false);
        this.paymentError.set(this.paymentErrorMessage(error));
      },
    });
  }

  paymentStepStatus(step: MembershipCheckoutStep): 'done' | 'active' | 'pending' {
    const order: MembershipCheckoutStep[] = ['plans', 'review', 'payment-ready'];
    const currentIndex = order.indexOf(this.checkoutStep());
    const stepIndex = order.indexOf(step);

    if (stepIndex < currentIndex) {
      return 'done';
    }

    if (stepIndex === currentIndex) {
      return 'active';
    }

    return 'pending';
  }

  stepIcon(step: MembershipCheckoutStep): LucideIconData {
    if (this.paymentStepStatus(step) === 'done') {
      return Check;
    }

    if (step === 'payment-ready') {
      return CreditCard;
    }

    return step === 'plans' ? Crown : ShieldCheck;
  }

  private paymentErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const message = typeof error.error?.message === 'string' ? error.error.message : '';
      if (message.includes('STRIPE_SECRET_KEY')) {
        return 'Falta configurar STRIPE_SECRET_KEY en el backend para crear la sesión de Stripe.';
      }
      if (message) {
        return message;
      }
    }

    return 'No pudimos preparar la sesión de Stripe. Revisa la configuración e inténtalo nuevamente.';
  }
}
