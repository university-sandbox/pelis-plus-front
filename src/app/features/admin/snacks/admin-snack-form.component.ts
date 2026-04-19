import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, X, Save } from 'lucide-angular';

import { AdminService } from '../../../core/services/admin.service';
import { type Snack } from '../../../core/models/snack.model';

@Component({
  selector: 'app-admin-snack-form',
  imports: [ReactiveFormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-snack-form.component.html',
  styleUrl: './admin-snack-form.component.scss',
})
export class AdminSnackFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly adminService = inject(AdminService);

  readonly snack = input<Snack | null>(null);
  readonly saved = output<Snack>();
  readonly cancelled = output<void>();

  readonly submitting = signal(false);
  readonly serverError = signal('');

  readonly X = X;
  readonly Save = Save;

  readonly form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    category: ['popcorn', Validators.required],
    price: [12, [Validators.required, Validators.min(0)]],
    image: [''],
    status: ['active'],
  });

  ngOnInit(): void {
    const s = this.snack();
    if (s) {
      this.form.patchValue({
        name: s.name,
        description: s.description,
        category: s.category,
        price: s.price,
        image: s.image ?? '',
        status: s.status,
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const payload = {
      name: v.name!,
      description: v.description ?? '',
      category: v.category!,
      price: Number(v.price),
      image: v.image || null,
      status: v.status ?? 'active',
    };
    this.submitting.set(true);
    const s = this.snack();
    const req = s
      ? this.adminService.updateSnack(s.id, payload)
      : this.adminService.createSnack(payload);
    req.subscribe({
      next: (snack) => { this.submitting.set(false); this.saved.emit(snack); },
      error: (err) => {
        this.submitting.set(false);
        this.serverError.set(err?.error?.message ?? 'Error al guardar el producto.');
      },
    });
  }

  onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.cancelled.emit();
  }
}
