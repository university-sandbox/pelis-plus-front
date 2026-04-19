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
  templateUrl: './admin-movie-form.component.html',
  styleUrl: './admin-movie-form.component.scss',
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
