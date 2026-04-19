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
import { type Screening } from '../../../core/models/screening.model';
import { type Movie } from '../../../core/models/movie.model';

@Component({
  selector: 'app-admin-screening-form',
  imports: [ReactiveFormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background: rgba(0,0,0,0.7);"
      (click)="onBackdrop($event)"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="relative w-full max-w-lg overflow-y-auto rounded-2xl"
        style="background: var(--color-surface); border: 1px solid var(--color-border);"
        (click)="$event.stopPropagation()"
      >
        <div
          class="flex items-center justify-between px-6 py-4"
          style="border-bottom: 1px solid var(--color-border);"
        >
          <h2 class="text-base font-bold" style="color: var(--color-text-primary);">
            {{ screening() ? 'Editar función' : 'Nueva función' }}
          </h2>
          <button type="button" (click)="cancelled.emit()" style="color: var(--color-text-secondary);" aria-label="Cerrar">
            <lucide-icon [img]="X" [size]="18" />
          </button>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="p-6 space-y-4">
          <!-- Movie -->
          <div>
            <label class="mb-1 block text-xs font-semibold" style="color: var(--color-text-secondary);">Película *</label>
            <select
              formControlName="movieId"
              class="form-input w-full rounded-lg px-3 py-2 text-sm"
              style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);"
            >
              <option value="">Seleccionar película</option>
              @for (m of movies(); track m.id) {
                <option [value]="m.id">{{ m.title }}</option>
              }
            </select>
          </div>

          <!-- Room -->
          <div>
            <label class="mb-1 block text-xs font-semibold" style="color: var(--color-text-secondary);">Sede / Sala *</label>
            <div class="grid grid-cols-2 gap-2">
              <select
                (change)="onVenueChange($event)"
                class="form-input rounded-lg px-3 py-2 text-sm"
                style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);"
              >
                <option value="">Sede</option>
                @for (v of venues(); track v.id) {
                  <option [value]="v.id">{{ v.name }}</option>
                }
              </select>
              <select
                formControlName="roomId"
                class="form-input rounded-lg px-3 py-2 text-sm"
                style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);"
              >
                <option value="">Sala</option>
                @for (r of rooms(); track r.id) {
                  <option [value]="r.id">{{ r.name }}</option>
                }
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Date -->
            <div>
              <label class="mb-1 block text-xs font-semibold" style="color: var(--color-text-secondary);">Fecha *</label>
              <input
                formControlName="date"
                type="date"
                class="form-input w-full rounded-lg px-3 py-2 text-sm"
                style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);"
              />
            </div>
            <!-- Time -->
            <div>
              <label class="mb-1 block text-xs font-semibold" style="color: var(--color-text-secondary);">Hora *</label>
              <input
                formControlName="time"
                type="time"
                class="form-input w-full rounded-lg px-3 py-2 text-sm"
                style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);"
              />
            </div>
            <!-- Format -->
            <div>
              <label class="mb-1 block text-xs font-semibold" style="color: var(--color-text-secondary);">Formato *</label>
              <select
                formControlName="format"
                class="form-input w-full rounded-lg px-3 py-2 text-sm"
                style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);"
              >
                <option value="standard">2D</option>
                <option value="3d">3D</option>
                <option value="imax">IMAX</option>
                <option value="dbox">D-BOX</option>
              </select>
            </div>
            <!-- Price -->
            <div>
              <label class="mb-1 block text-xs font-semibold" style="color: var(--color-text-secondary);">Precio (S/) *</label>
              <input
                formControlName="price"
                type="number"
                step="0.5"
                min="0"
                class="form-input w-full rounded-lg px-3 py-2 text-sm"
                style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);"
                placeholder="22.00"
              />
            </div>
          </div>

          @if (serverError()) {
            <p class="rounded-lg px-3 py-2 text-sm" style="background: rgba(239,68,68,0.1); color: var(--color-error);">
              {{ serverError() }}
            </p>
          }

          <div class="flex justify-end gap-3 pt-2">
            <button type="button" (click)="cancelled.emit()"
              class="rounded-full border px-5 py-2 text-sm font-medium"
              style="border-color: var(--color-border-strong); color: var(--color-text-secondary);">Cancelar</button>
            <button type="submit" [disabled]="submitting() || form.invalid"
              class="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold disabled:opacity-50"
              style="background: var(--color-accent); color: var(--color-text-inverse);">
              <lucide-icon [img]="Save" [size]="14" />
              {{ submitting() ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: `.form-input:focus { outline: 2px solid var(--color-accent); outline-offset: 0; }`,
})
export class AdminScreeningFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly adminService = inject(AdminService);

  readonly screening = input<Screening | null>(null);
  readonly saved = output<Screening>();
  readonly cancelled = output<void>();

  readonly movies = signal<Movie[]>([]);
  readonly venues = signal<Array<{ id: string; name: string; address: string; city: string }>>([]);
  readonly rooms = signal<Array<{ id: string; name: string }>>([]);
  readonly submitting = signal(false);
  readonly serverError = signal('');

  readonly X = X;
  readonly Save = Save;

  readonly form = this.fb.group({
    movieId: ['', Validators.required],
    roomId: ['', Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required],
    format: ['standard', Validators.required],
    price: [22, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    this.adminService.getMovies().subscribe({ next: (m) => this.movies.set(m) });
    this.adminService.getVenues().subscribe({ next: (v) => this.venues.set(v) });

    const s = this.screening();
    if (s) {
      this.form.patchValue({
        movieId: s.movieId.toString(),
        roomId: s.room.id,
        date: s.date,
        time: s.time,
        format: s.format,
        price: s.price,
      });
      // Load rooms for this venue
      this.adminService.getRooms().subscribe({
        next: (allRooms) => this.rooms.set(allRooms.filter((r) => r.venueId === s.venue.id)),
      });
    }
  }

  onVenueChange(event: Event): void {
    const venueId = (event.target as HTMLSelectElement).value;
    if (!venueId) { this.rooms.set([]); return; }
    this.adminService.getRooms().subscribe({
      next: (allRooms) => this.rooms.set(allRooms.filter((r) => r.venueId === venueId)),
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const payload = {
      movieId: Number(v.movieId),
      roomId: v.roomId!,
      date: v.date!,
      time: v.time!,
      format: v.format!,
      price: Number(v.price),
    };
    this.submitting.set(true);
    const s = this.screening();
    const req = s
      ? this.adminService.updateScreening(s.id, payload)
      : this.adminService.createScreening(payload);
    req.subscribe({
      next: (sc) => { this.submitting.set(false); this.saved.emit(sc); },
      error: (err) => {
        this.submitting.set(false);
        this.serverError.set(err?.error?.message ?? 'Error al guardar la función.');
      },
    });
  }

  onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.cancelled.emit();
  }
}
