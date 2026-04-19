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
  templateUrl: './admin-screening-form.component.html',
  styleUrl: './admin-screening-form.component.scss',
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
