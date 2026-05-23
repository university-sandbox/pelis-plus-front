import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
  type OnInit,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, Save, X } from 'lucide-angular';

import {
  AdminService,
  type AdminRoomLayout,
  type AdminRoomLayoutPayload,
} from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-room-layout-form',
  imports: [ReactiveFormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-room-layout-form.component.html',
  styleUrl: './admin-room-form.component.scss',
})
export class AdminRoomLayoutFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly adminService = inject(AdminService);

  readonly layout = input<AdminRoomLayout | null>(null);
  readonly saved = output<AdminRoomLayout>();
  readonly cancelled = output<void>();

  readonly submitting = signal(false);
  readonly serverError = signal('');
  readonly rows = signal(8);
  readonly cols = signal(10);
  readonly inferredCapacity = computed(() => this.rows() * this.cols());

  readonly X = X;
  readonly Save = Save;

  readonly form = this.fb.group({
    name: ['', Validators.required],
    rows: [8, [Validators.required, Validators.min(1), Validators.max(40)]],
    cols: [10, [Validators.required, Validators.min(1), Validators.max(40)]],
    capacity: [80, [Validators.required, Validators.min(1)]],
    active: [true, Validators.required],
  });

  ngOnInit(): void {
    const layout = this.layout();
    if (layout) {
      this.form.patchValue({
        name: layout.name,
        rows: layout.rows,
        cols: layout.cols,
        capacity: layout.capacity,
        active: layout.active,
      });
      this.rows.set(layout.rows);
      this.cols.set(layout.cols);
    }

    this.form.controls.rows.valueChanges.subscribe((value) => {
      const rows = Number(value) || 1;
      this.rows.set(rows);
      this.syncCapacity();
    });
    this.form.controls.cols.valueChanges.subscribe((value) => {
      const cols = Number(value) || 1;
      this.cols.set(cols);
      this.syncCapacity();
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    const payload: AdminRoomLayoutPayload = {
      name: (value.name ?? '').trim(),
      rows: Number(value.rows),
      cols: Number(value.cols),
      capacity: Number(value.capacity),
      seatMap: null,
      active: value.active === true,
    };
    const layout = this.layout();
    const request = layout
      ? this.adminService.updateRoomLayout(layout.id, payload)
      : this.adminService.createRoomLayout(payload);
    this.submitting.set(true);
    request.subscribe({
      next: (saved) => {
        this.submitting.set(false);
        this.saved.emit(saved);
      },
      error: (error) => {
        this.submitting.set(false);
        this.serverError.set(error?.error?.message ?? 'Error al guardar la distribución.');
      },
    });
  }

  onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.cancelled.emit();
  }

  private syncCapacity(): void {
    this.form.controls.capacity.setValue(this.inferredCapacity(), { emitEvent: false });
  }
}
