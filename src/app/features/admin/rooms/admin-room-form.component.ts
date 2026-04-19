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
  templateUrl: './admin-room-form.component.html',
  styleUrl: './admin-room-form.component.scss',
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
