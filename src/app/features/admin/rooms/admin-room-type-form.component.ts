import {
  ChangeDetectionStrategy,
  Component,
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
  type AdminRoomType,
  type AdminRoomTypePayload,
} from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-room-type-form',
  imports: [ReactiveFormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-room-type-form.component.html',
  styleUrl: './admin-room-form.component.scss',
})
export class AdminRoomTypeFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly adminService = inject(AdminService);

  readonly roomType = input<AdminRoomType | null>(null);
  readonly saved = output<AdminRoomType>();
  readonly cancelled = output<void>();

  readonly submitting = signal(false);
  readonly serverError = signal('');

  readonly X = X;
  readonly Save = Save;

  readonly form = this.fb.group({
    code: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    name: ['', Validators.required],
    description: ['', Validators.required],
    active: [true, Validators.required],
  });

  ngOnInit(): void {
    const roomType = this.roomType();
    if (!roomType) return;
    this.form.patchValue({
      code: roomType.code,
      name: roomType.name,
      description: roomType.description,
      active: roomType.active,
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    const payload: AdminRoomTypePayload = {
      code: (value.code ?? '').trim().toLowerCase(),
      name: (value.name ?? '').trim(),
      description: (value.description ?? '').trim(),
      active: value.active === true,
    };
    const roomType = this.roomType();
    const request = roomType
      ? this.adminService.updateRoomType(roomType.id, payload)
      : this.adminService.createRoomType(payload);
    this.submitting.set(true);
    request.subscribe({
      next: (saved) => {
        this.submitting.set(false);
        this.saved.emit(saved);
      },
      error: (error) => {
        this.submitting.set(false);
        this.serverError.set(error?.error?.message ?? 'Error al guardar el tipo de sala.');
      },
    });
  }

  onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.cancelled.emit();
  }
}
