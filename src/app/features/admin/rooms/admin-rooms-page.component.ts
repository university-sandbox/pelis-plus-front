import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { LucideAngularModule, Plus, Pencil, ToggleLeft, ToggleRight, RefreshCw } from 'lucide-angular';

import { AdminService, type AdminRoom } from '../../../core/services/admin.service';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { AdminRoomFormComponent } from './admin-room-form.component';

@Component({
  selector: 'app-admin-rooms-page',
  imports: [LucideAngularModule, SkeletonLoaderComponent, AdminRoomFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <div class="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold" style="color: var(--color-text-primary);">Salas</h1>
          <p class="text-sm" style="color: var(--color-text-secondary);">{{ rooms().length }} salas</p>
        </div>
        <button type="button" (click)="openCreate()"
          class="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
          style="background: var(--color-accent); color: var(--color-text-inverse);">
          <lucide-icon [img]="Plus" [size]="15" />Nueva sala
        </button>
      </div>

      @if (loading()) {
        <div class="space-y-3">@for (n of [1,2,3]; track n) { <app-skeleton-loader height="56px" radius="8px" /> }</div>
      } @else if (error()) {
        <div class="rounded-xl p-6 text-center" style="background: var(--color-surface); border: 1px solid var(--color-border);">
          <p class="mb-3 text-sm" style="color: var(--color-text-secondary);">Error al cargar salas.</p>
          <button type="button" (click)="load()" class="text-sm" style="color: var(--color-accent);">
            <lucide-icon [img]="RefreshCw" [size]="14" class="inline mr-1" />Reintentar</button>
        </div>
      } @else {
        <!-- Group by venue -->
        @for (group of venueGroups(); track group.venueId) {
          <div class="mb-6">
            <h2 class="mb-3 text-sm font-bold" style="color: var(--color-text-secondary);">{{ group.venueName }}</h2>
            <div class="overflow-hidden rounded-xl" style="border: 1px solid var(--color-border); background: var(--color-surface);">
              <table class="w-full text-sm">
                <thead>
                  <tr style="border-bottom: 1px solid var(--color-border); background: var(--color-surface-raised);">
                    <th class="px-4 py-3 text-left font-semibold" style="color: var(--color-text-secondary);">Nombre</th>
                    <th class="px-4 py-3 text-left font-semibold hidden sm:table-cell" style="color: var(--color-text-secondary);">Capacidad</th>
                    <th class="px-4 py-3 text-left font-semibold hidden md:table-cell" style="color: var(--color-text-secondary);">Filas × Cols</th>
                    <th class="px-4 py-3 text-left font-semibold hidden sm:table-cell" style="color: var(--color-text-secondary);">Activa</th>
                    <th class="px-4 py-3 text-right font-semibold" style="color: var(--color-text-secondary);">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (r of group.rooms; track r.id) {
                    <tr style="border-bottom: 1px solid var(--color-border);">
                      <td class="px-4 py-3 font-medium" style="color: var(--color-text-primary);">{{ r.name }}</td>
                      <td class="px-4 py-3 hidden sm:table-cell" style="color: var(--color-text-secondary);">{{ r.capacity }}</td>
                      <td class="px-4 py-3 hidden md:table-cell" style="color: var(--color-text-secondary);">{{ r.rows }} × {{ r.cols }}</td>
                      <td class="px-4 py-3 hidden sm:table-cell">
                        <button type="button" (click)="toggleActive(r)" [disabled]="toggling() === r.id">
                          @if (r.active !== false) {
                            <lucide-icon [img]="ToggleRight" [size]="22" style="color: var(--color-success);" />
                          } @else {
                            <lucide-icon [img]="ToggleLeft" [size]="22" style="color: var(--color-text-disabled);" />
                          }
                        </button>
                      </td>
                      <td class="px-4 py-3 text-right">
                        <button type="button" (click)="openEdit(r)"
                          class="rounded-lg p-2 transition-colors" style="color: var(--color-text-secondary);" title="Editar">
                          <lucide-icon [img]="Pencil" [size]="14" />
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      }
    </div>

    @if (showForm()) {
      <app-admin-room-form
        [room]="editingRoom()"
        (saved)="onSaved($event)"
        (cancelled)="showForm.set(false)"
      />
    }
  `,
})
export class AdminRoomsPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  readonly rooms = signal<AdminRoom[]>([]);
  readonly venues = signal<Array<{ id: string; name: string }>>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly showForm = signal(false);
  readonly editingRoom = signal<AdminRoom | null>(null);
  readonly toggling = signal<string | null>(null);

  readonly Plus = Plus;
  readonly Pencil = Pencil;
  readonly ToggleLeft = ToggleLeft;
  readonly ToggleRight = ToggleRight;
  readonly RefreshCw = RefreshCw;

  readonly venueGroups = () => {
    const venueMap = new Map<string, { venueId: string; venueName: string; rooms: AdminRoom[] }>();
    for (const venue of this.venues()) {
      venueMap.set(venue.id, { venueId: venue.id, venueName: venue.name, rooms: [] });
    }
    for (const room of this.rooms()) {
      const group = venueMap.get(room.venueId);
      if (group) group.rooms.push(room);
      else venueMap.set(room.venueId, { venueId: room.venueId, venueName: room.venueId, rooms: [room] });
    }
    return Array.from(venueMap.values()).filter((g) => g.rooms.length > 0);
  };

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.adminService.getVenues().subscribe({ next: (v) => this.venues.set(v) });
    this.adminService.getRooms().subscribe({
      next: (r) => { this.rooms.set(r); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  openCreate(): void { this.editingRoom.set(null); this.showForm.set(true); }
  openEdit(r: AdminRoom): void { this.editingRoom.set(r); this.showForm.set(true); }

  toggleActive(r: AdminRoom): void {
    this.toggling.set(r.id);
    this.adminService.toggleRoomStatus(r.id).subscribe({
      next: (updated) => {
        this.rooms.update((list) => list.map((x) => (x.id === updated.id ? updated : x)));
        this.toggling.set(null);
      },
      error: () => this.toggling.set(null),
    });
  }

  onSaved(r: AdminRoom): void {
    this.rooms.update((list) => {
      const idx = list.findIndex((x) => x.id === r.id);
      return idx >= 0 ? list.map((x) => (x.id === r.id ? r : x)) : [...list, r];
    });
    this.showForm.set(false);
  }
}
