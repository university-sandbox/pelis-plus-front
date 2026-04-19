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
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background: rgba(0,0,0,0.7);"
      (click)="onBackdrop($event)" role="dialog" aria-modal="true">
      <div class="relative w-full max-w-md rounded-2xl"
        style="background: var(--color-surface); border: 1px solid var(--color-border);"
        (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between px-6 py-4" style="border-bottom: 1px solid var(--color-border);">
          <h2 class="text-base font-bold" style="color: var(--color-text-primary);">
            {{ snack() ? 'Editar producto' : 'Nuevo producto' }}
          </h2>
          <button type="button" (click)="cancelled.emit()" style="color: var(--color-text-secondary);" aria-label="Cerrar">
            <lucide-icon [img]="X" [size]="18" />
          </button>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="p-6 space-y-4">
          <div>
            <label class="mb-1 block text-xs font-semibold" style="color: var(--color-text-secondary);">Nombre *</label>
            <input formControlName="name" type="text"
              class="form-input w-full rounded-lg px-3 py-2 text-sm"
              style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);"
              placeholder="Canchita Grande" />
          </div>
          <div>
            <label class="mb-1 block text-xs font-semibold" style="color: var(--color-text-secondary);">Descripción</label>
            <textarea formControlName="description" rows="2"
              class="form-input w-full rounded-lg px-3 py-2 text-sm resize-none"
              style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-xs font-semibold" style="color: var(--color-text-secondary);">Categoría *</label>
              <select formControlName="category"
                class="form-input w-full rounded-lg px-3 py-2 text-sm"
                style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);">
                <option value="popcorn">Canchitas</option>
                <option value="drinks">Bebidas</option>
                <option value="combos">Combos</option>
                <option value="sweets">Dulces</option>
                <option value="extras">Extras</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold" style="color: var(--color-text-secondary);">Precio (S/) *</label>
              <input formControlName="price" type="number" step="0.5" min="0"
                class="form-input w-full rounded-lg px-3 py-2 text-sm"
                style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);"
                placeholder="12.00" />
            </div>
          </div>
          <div>
            <label class="mb-1 block text-xs font-semibold" style="color: var(--color-text-secondary);">URL de imagen</label>
            <input formControlName="image" type="url"
              class="form-input w-full rounded-lg px-3 py-2 text-sm"
              style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);"
              placeholder="https://..." />
          </div>
          <div>
            <label class="mb-1 block text-xs font-semibold" style="color: var(--color-text-secondary);">Estado</label>
            <select formControlName="status"
              class="form-input w-full rounded-lg px-3 py-2 text-sm"
              style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);">
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>

          @if (serverError()) {
            <p class="rounded-lg px-3 py-2 text-sm" style="background: rgba(239,68,68,0.1); color: var(--color-error);">{{ serverError() }}</p>
          }

          <div class="flex justify-end gap-3 pt-2">
            <button type="button" (click)="cancelled.emit()"
              class="rounded-full border px-5 py-2 text-sm font-medium"
              style="border-color: var(--color-border-strong); color: var(--color-text-secondary);">Cancelar</button>
            <button type="submit" [disabled]="submitting() || form.invalid"
              class="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold disabled:opacity-50"
              style="background: var(--color-accent); color: var(--color-text-inverse);">
              <lucide-icon [img]="Save" [size]="14" />{{ submitting() ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: `.form-input:focus { outline: 2px solid var(--color-accent); outline-offset: 0; }`,
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
