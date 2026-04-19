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
import { type Movie, type Genre } from '../../../core/models/movie.model';

@Component({
  selector: 'app-admin-movie-form',
  imports: [ReactiveFormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Backdrop -->
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background: rgba(0,0,0,0.7);"
      (click)="onBackdrop($event)"
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="movie() ? 'Editar película' : 'Nueva película'"
    >
      <div
        class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style="background: var(--color-surface); border: 1px solid var(--color-border);"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div
          class="sticky top-0 flex items-center justify-between px-6 py-4 z-10"
          style="background: var(--color-surface); border-bottom: 1px solid var(--color-border);"
        >
          <h2 class="text-base font-bold" style="color: var(--color-text-primary);">
            {{ movie() ? 'Editar película' : 'Nueva película' }}
          </h2>
          <button
            type="button"
            (click)="cancelled.emit()"
            class="rounded-lg p-1.5 transition-colors"
            style="color: var(--color-text-secondary);"
            aria-label="Cerrar"
          >
            <lucide-icon [img]="X" [size]="18" aria-hidden="true" />
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="submit()" class="p-6 space-y-4">

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <!-- Title -->
            <div class="sm:col-span-2">
              <label class="mb-1 block text-xs font-semibold" style="color: var(--color-text-secondary);">Título *</label>
              <input
                formControlName="title"
                type="text"
                class="form-input w-full rounded-lg px-3 py-2 text-sm"
                style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);"
                placeholder="Título de la película"
              />
              @if (form.get('title')?.invalid && form.get('title')?.touched) {
                <p class="mt-1 text-xs" style="color: var(--color-error);">Campo requerido</p>
              }
            </div>

            <!-- Overview -->
            <div class="sm:col-span-2">
              <label class="mb-1 block text-xs font-semibold" style="color: var(--color-text-secondary);">Sinopsis</label>
              <textarea
                formControlName="overview"
                rows="3"
                class="form-input w-full rounded-lg px-3 py-2 text-sm resize-none"
                style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);"
                placeholder="Descripción de la película"
              ></textarea>
            </div>

            <!-- Release date -->
            <div>
              <label class="mb-1 block text-xs font-semibold" style="color: var(--color-text-secondary);">Fecha de estreno</label>
              <input
                formControlName="releaseDate"
                type="date"
                class="form-input w-full rounded-lg px-3 py-2 text-sm"
                style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);"
              />
            </div>

            <!-- Runtime -->
            <div>
              <label class="mb-1 block text-xs font-semibold" style="color: var(--color-text-secondary);">Duración (min)</label>
              <input
                formControlName="runtime"
                type="number"
                min="1"
                class="form-input w-full rounded-lg px-3 py-2 text-sm"
                style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);"
                placeholder="120"
              />
            </div>

            <!-- Status -->
            <div>
              <label class="mb-1 block text-xs font-semibold" style="color: var(--color-text-secondary);">Estado de cartelera</label>
              <select
                formControlName="status"
                class="form-input w-full rounded-lg px-3 py-2 text-sm"
                style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);"
              >
                <option value="now_playing">En cartelera</option>
                <option value="upcoming">Próximamente</option>
                <option value="popular">Popular</option>
              </select>
            </div>

            <!-- Language -->
            <div>
              <label class="mb-1 block text-xs font-semibold" style="color: var(--color-text-secondary);">Idioma original</label>
              <input
                formControlName="originalLanguage"
                type="text"
                maxlength="5"
                class="form-input w-full rounded-lg px-3 py-2 text-sm"
                style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);"
                placeholder="en"
              />
            </div>

            <!-- Poster URL -->
            <div>
              <label class="mb-1 block text-xs font-semibold" style="color: var(--color-text-secondary);">Ruta del póster</label>
              <input
                formControlName="posterPath"
                type="text"
                class="form-input w-full rounded-lg px-3 py-2 text-sm"
                style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);"
                placeholder="/xxxxxxxx.jpg"
              />
            </div>

            <!-- Backdrop URL -->
            <div>
              <label class="mb-1 block text-xs font-semibold" style="color: var(--color-text-secondary);">Ruta del backdrop</label>
              <input
                formControlName="backdropPath"
                type="text"
                class="form-input w-full rounded-lg px-3 py-2 text-sm"
                style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);"
                placeholder="/xxxxxxxx.jpg"
              />
            </div>

            <!-- Vote average -->
            <div>
              <label class="mb-1 block text-xs font-semibold" style="color: var(--color-text-secondary);">Calificación (0-10)</label>
              <input
                formControlName="voteAverage"
                type="number"
                step="0.1"
                min="0"
                max="10"
                class="form-input w-full rounded-lg px-3 py-2 text-sm"
                style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);"
                placeholder="7.5"
              />
            </div>

            <!-- Genres -->
            <div class="sm:col-span-2">
              <label class="mb-2 block text-xs font-semibold" style="color: var(--color-text-secondary);">Géneros</label>
              <div class="flex flex-wrap gap-2">
                @for (genre of genres(); track genre.id) {
                  <label class="flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors"
                    [style.background]="isGenreSelected(genre.id) ? 'rgba(0,201,167,0.15)' : 'var(--color-surface-raised)'"
                    [style.border-color]="isGenreSelected(genre.id) ? 'var(--color-accent)' : 'var(--color-border)'"
                    [style.color]="isGenreSelected(genre.id) ? 'var(--color-accent)' : 'var(--color-text-secondary)'"
                  >
                    <input
                      type="checkbox"
                      class="sr-only"
                      [checked]="isGenreSelected(genre.id)"
                      (change)="toggleGenre(genre.id)"
                    />
                    {{ genre.name }}
                  </label>
                }
              </div>
            </div>

            <!-- Toggles -->
            <div class="flex items-center gap-3">
              <label class="flex cursor-pointer items-center gap-2 text-sm" style="color: var(--color-text-secondary);">
                <input type="checkbox" formControlName="active" class="h-4 w-4 accent-[var(--color-accent)]" />
                Activa (visible al público)
              </label>
            </div>
            <div class="flex items-center gap-3">
              <label class="flex cursor-pointer items-center gap-2 text-sm" style="color: var(--color-text-secondary);">
                <input type="checkbox" formControlName="adult" class="h-4 w-4 accent-[var(--color-accent)]" />
                Solo adultos (+18)
              </label>
            </div>
          </div>

          @if (serverError()) {
            <p class="rounded-lg px-3 py-2 text-sm" style="background: rgba(239,68,68,0.1); color: var(--color-error);">
              {{ serverError() }}
            </p>
          }

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              (click)="cancelled.emit()"
              class="rounded-full border px-5 py-2 text-sm font-medium transition-colors"
              style="border-color: var(--color-border-strong); color: var(--color-text-secondary);"
            >
              Cancelar
            </button>
            <button
              type="submit"
              [disabled]="submitting() || form.invalid"
              class="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors disabled:opacity-50"
              style="background: var(--color-accent); color: var(--color-text-inverse);"
            >
              <lucide-icon [img]="Save" [size]="14" aria-hidden="true" />
              {{ submitting() ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: `
    .form-input:focus {
      outline: 2px solid var(--color-accent);
      outline-offset: 0;
      border-color: var(--color-accent) !important;
    }
  `,
})
export class AdminMovieFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly adminService = inject(AdminService);

  readonly movie = input<Movie | null>(null);
  readonly saved = output<Movie>();
  readonly cancelled = output<void>();

  readonly genres = signal<Genre[]>([]);
  readonly selectedGenreIds = signal<number[]>([]);
  readonly submitting = signal(false);
  readonly serverError = signal('');

  readonly X = X;
  readonly Save = Save;

  readonly form = this.fb.group({
    title: ['', Validators.required],
    overview: [''],
    releaseDate: [''],
    runtime: [null as number | null],
    status: ['now_playing'],
    originalLanguage: ['es'],
    posterPath: [''],
    backdropPath: [''],
    voteAverage: [0],
    active: [true],
    adult: [false],
  });

  ngOnInit(): void {
    this.adminService.getGenres().subscribe({ next: (g) => this.genres.set(g) });

    const m = this.movie();
    if (m) {
      this.form.patchValue({
        title: m.title,
        overview: m.overview,
        releaseDate: m.releaseDate ?? '',
        runtime: m.runtime ?? null,
        status: m.status ?? 'now_playing',
        originalLanguage: m.originalLanguage ?? 'es',
        posterPath: m.posterPath ?? '',
        backdropPath: m.backdropPath ?? '',
        voteAverage: m.voteAverage ?? 0,
        active: m.active !== false,
        adult: m.adult ?? false,
      });
      this.selectedGenreIds.set(m.genreIds ?? []);
    }
  }

  isGenreSelected(id: number): boolean {
    return this.selectedGenreIds().includes(id);
  }

  toggleGenre(id: number): void {
    const ids = this.selectedGenreIds();
    this.selectedGenreIds.set(
      ids.includes(id) ? ids.filter((g) => g !== id) : [...ids, id],
    );
  }

  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const payload = {
      title: v.title!,
      overview: v.overview ?? '',
      posterPath: v.posterPath || null,
      backdropPath: v.backdropPath || null,
      releaseDate: v.releaseDate ?? '',
      runtime: v.runtime ?? null,
      status: v.status ?? 'now_playing',
      originalLanguage: v.originalLanguage ?? 'es',
      popularity: this.movie()?.popularity ?? 0,
      voteAverage: v.voteAverage ?? 0,
      voteCount: this.movie()?.voteCount ?? 0,
      genreIds: this.selectedGenreIds(),
      adult: v.adult ?? false,
      video: false,
      active: v.active ?? true,
    };

    this.submitting.set(true);
    this.serverError.set('');

    const m = this.movie();
    const req = m
      ? this.adminService.updateMovie(m.id, payload)
      : this.adminService.createMovie(payload);

    req.subscribe({
      next: (movie) => { this.submitting.set(false); this.saved.emit(movie); },
      error: (err) => {
        this.submitting.set(false);
        this.serverError.set(err?.error?.message ?? 'Error al guardar la película.');
      },
    });
  }

  onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.cancelled.emit();
  }
}
