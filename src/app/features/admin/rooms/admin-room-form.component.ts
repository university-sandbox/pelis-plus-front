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
import { LucideAngularModule, X, Save } from 'lucide-angular';

import {
  AdminService,
  type AdminRoom,
  type AdminRoomLayout,
  type AdminRoomType,
} from '../../../core/services/admin.service';

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
  readonly roomTypes = signal<AdminRoomType[]>([]);
  readonly roomLayouts = signal<AdminRoomLayout[]>([]);
  readonly submitting = signal(false);
  readonly serverError = signal('');
  readonly selectedLayoutId = signal('');
  readonly selectedLayout = computed(
    () => this.roomLayouts().find((layout) => layout.id === this.selectedLayoutId()) ?? null,
  );

  readonly X = X;
  readonly Save = Save;

  readonly form = this.fb.group({
    venueId: ['', Validators.required],
    roomTypeId: ['', Validators.required],
    roomLayoutId: ['', Validators.required],
    name: ['', Validators.required],
  });

  ngOnInit(): void {
    this.adminService.getVenues().subscribe({ next: (v) => this.venues.set(v) });
    this.adminService.getRoomTypes().subscribe({
      next: (roomTypes) =>
        this.roomTypes.set(
          roomTypes.filter(
            (roomType) => roomType.active || roomType.id === this.room()?.roomType?.id,
          ),
        ),
    });
    this.adminService.getRoomLayouts().subscribe({
      next: (layouts) =>
        this.roomLayouts.set(
          layouts.filter((layout) => layout.active || layout.id === this.room()?.roomLayout?.id),
        ),
    });
    const r = this.room();
    if (r) {
      this.form.patchValue({
        venueId: r.venueId,
        roomTypeId: r.roomType?.id ?? '',
        roomLayoutId: r.roomLayout?.id ?? '',
        name: r.name,
      });
      this.selectedLayoutId.set(r.roomLayout?.id ?? '');
    }
  }

  onLayoutChange(event: Event): void {
    this.selectedLayoutId.set((event.target as HTMLSelectElement).value);
  }

  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const payload = {
      venueId: v.venueId!,
      roomTypeId: v.roomTypeId!,
      roomLayoutId: v.roomLayoutId!,
      name: v.name!,
    };
    this.submitting.set(true);
    const r = this.room();
    const req = r
      ? this.adminService.updateRoom(r.id, payload)
      : this.adminService.createRoom(payload);
    req.subscribe({
      next: (room) => {
        this.submitting.set(false);
        this.saved.emit(room);
      },
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
