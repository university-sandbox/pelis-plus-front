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
  templateUrl: './admin-rooms-page.component.html',
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
