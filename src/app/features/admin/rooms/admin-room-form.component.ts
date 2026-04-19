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

import { AdminService, type AdminRoom } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-room-form',
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
            {{ room() ? 'Editar sala' : 'Nueva sala' }}
          </h2>
          <button type="button" (click)="cancelled.emit()" style="color: var(--color-text-secondary);" aria-label="Cerrar">
            <lucide-icon [img]="X" [size]="18" />
          </button>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="p-6 space-y-4">
          <!-- Venue -->
          <div>
            <label class="mb-1 block text-xs font-semibold" style="color: var(--color-text-secondary);">Sede *</label>
            <select formControlName="venueId"
              class="form-input w-full rounded-lg px-3 py-2 text-sm"
              style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);">
              <option value="">Seleccionar sede</option>
              @for (v of venues(); track v.id) {
                <option [value]="v.id">{{ v.name }}</option>
              }
            </select>
          </div>
          <!-- Name -->
          <div>
            <label class="mb-1 block text-xs font-semibold" style="color: var(--color-text-secondary);">Nombre *</label>
            <input formControlName="name" type="text"
              class="form-input w-full rounded-lg px-3 py-2 text-sm"
              style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);"
              placeholder="Sala 1 - IMAX" />
          </div>
          <div class="grid grid-cols-3 gap-3">
            <!-- Capacity -->
            <div>
              <label class="mb-1 block text-xs font-semibold" style="color: var(--color-text-secondary);">Capacidad</label>
              <input formControlName="capacity" type="number" min="1"
                class="form-input w-full rounded-lg px-3 py-2 text-sm"
                style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);" />
            </div>
            <!-- Rows -->
            <div>
              <label class="mb-1 block text-xs font-semibold" style="color: var(--color-text-secondary);">Filas</label>
              <input formControlName="rows" type="number" min="1"
                class="form-input w-full rounded-lg px-3 py-2 text-sm"
                style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);" />
            </div>
            <!-- Cols -->
            <div>
              <label class="mb-1 block text-xs font-semibold" style="color: var(--color-text-secondary);">Columnas</label>
              <input formControlName="cols" type="number" min="1"
                class="form-input w-full rounded-lg px-3 py-2 text-sm"
                style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);" />
            </div>
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
export class AdminRoomFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly adminService = inject(AdminService);

  readonly room = input<AdminRoom | null>(null);
  readonly saved = output<AdminRoom>();
  readonly cancelled = output<void>();

  readonly venues = signal<Array<{ id: string; name: string; address: string; city: string }>>([]);
  readonly submitting = signal(false);
  readonly serverError = signal('');

  readonly X = X;
  readonly Save = Save;

  readonly form = this.fb.group({
    venueId: ['', Validators.required],
    name: ['', Validators.required],
    capacity: [80, [Validators.required, Validators.min(1)]],
    rows: [8, [Validators.required, Validators.min(1)]],
    cols: [10, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.adminService.getVenues().subscribe({ next: (v) => this.venues.set(v) });
    const r = this.room();
    if (r) {
      this.form.patchValue({
        venueId: r.venueId,
        name: r.name,
        capacity: r.capacity,
        rows: r.rows,
        cols: r.cols,
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const payload = {
      venueId: v.venueId!,
      name: v.name!,
      capacity: Number(v.capacity),
      rows: Number(v.rows),
      cols: Number(v.cols),
    };
    this.submitting.set(true);
    const r = this.room();
    const req = r
      ? this.adminService.updateRoom(r.id, payload)
      : this.adminService.createRoom(payload);
    req.subscribe({
      next: (room) => { this.submitting.set(false); this.saved.emit(room); },
      error: (err) => {
        this.submitting.set(false);
        this.serverError.set(err?.error?.message ?? 'Error al guardar la sala.');
      },
    });
  }

  onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.cancelled.emit();
  }
}
