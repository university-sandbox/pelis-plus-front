import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  type OnInit,
} from '@angular/core';
import {
  Armchair,
  Layers3,
  LucideAngularModule,
  Pencil,
  Plus,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
} from 'lucide-angular';

import {
  AdminService,
  type AdminRoom,
  type AdminRoomLayout,
  type AdminRoomType,
} from '../../../core/services/admin.service';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { AdminRoomFormComponent } from './admin-room-form.component';
import { AdminRoomLayoutFormComponent } from './admin-room-layout-form.component';
import { AdminRoomTypeFormComponent } from './admin-room-type-form.component';

type RoomModal = 'room' | 'type' | 'layout';
type RoomTab = 'rooms' | 'types' | 'layouts';

@Component({
  selector: 'app-admin-rooms-page',
  imports: [
    LucideAngularModule,
    SkeletonLoaderComponent,
    AdminRoomFormComponent,
    AdminRoomTypeFormComponent,
    AdminRoomLayoutFormComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-rooms-page.component.html',
})
export class AdminRoomsPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  readonly rooms = signal<AdminRoom[]>([]);
  readonly roomTypes = signal<AdminRoomType[]>([]);
  readonly roomLayouts = signal<AdminRoomLayout[]>([]);
  readonly venues = signal<Array<{ id: string; name: string }>>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly showForm = signal(false);
  readonly modal = signal<RoomModal>('room');
  readonly activeTab = signal<RoomTab>('rooms');
  readonly editingRoom = signal<AdminRoom | null>(null);
  readonly editingRoomType = signal<AdminRoomType | null>(null);
  readonly editingRoomLayout = signal<AdminRoomLayout | null>(null);
  readonly toggling = signal<string | null>(null);

  readonly Plus = Plus;
  readonly Pencil = Pencil;
  readonly ToggleLeft = ToggleLeft;
  readonly ToggleRight = ToggleRight;
  readonly RefreshCw = RefreshCw;
  readonly Armchair = Armchair;
  readonly Layers3 = Layers3;

  readonly activeTypes = computed(
    () => this.roomTypes().filter((roomType) => roomType.active).length,
  );
  readonly activeLayouts = computed(
    () => this.roomLayouts().filter((layout) => layout.active).length,
  );
  readonly activeRooms = computed(
    () => this.rooms().filter((room) => room.active !== false).length,
  );

  readonly tabs: Array<{ value: RoomTab; label: string }> = [
    { value: 'rooms', label: 'Salas' },
    { value: 'types', label: 'Tipos' },
    { value: 'layouts', label: 'Distribuciones' },
  ];

  readonly venueGroups = computed(() => {
    const venueMap = new Map<string, { venueId: string; venueName: string; rooms: AdminRoom[] }>();
    for (const venue of this.venues()) {
      venueMap.set(venue.id, { venueId: venue.id, venueName: venue.name, rooms: [] });
    }
    for (const room of this.rooms()) {
      const group = venueMap.get(room.venueId);
      if (group) group.rooms.push(room);
      else
        venueMap.set(room.venueId, {
          venueId: room.venueId,
          venueName: room.venueId,
          rooms: [room],
        });
    }
    return Array.from(venueMap.values()).filter((g) => g.rooms.length > 0);
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.adminService.getVenues().subscribe({ next: (v) => this.venues.set(v) });
    this.adminService
      .getRoomTypes()
      .subscribe({ next: (roomTypes) => this.roomTypes.set(roomTypes) });
    this.adminService
      .getRoomLayouts()
      .subscribe({ next: (layouts) => this.roomLayouts.set(layouts) });
    this.adminService.getRooms().subscribe({
      next: (r) => {
        this.rooms.set(r);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  setTab(tab: RoomTab): void {
    this.activeTab.set(tab);
  }

  openCreate(): void {
    if (this.activeTab() === 'types') {
      this.openCreateType();
      return;
    }
    if (this.activeTab() === 'layouts') {
      this.openCreateLayout();
      return;
    }
    this.editingRoom.set(null);
    this.modal.set('room');
    this.showForm.set(true);
  }

  openEdit(r: AdminRoom): void {
    this.editingRoom.set(r);
    this.modal.set('room');
    this.showForm.set(true);
  }

  openCreateType(): void {
    this.editingRoomType.set(null);
    this.modal.set('type');
    this.showForm.set(true);
  }

  openEditType(roomType: AdminRoomType): void {
    this.editingRoomType.set(roomType);
    this.modal.set('type');
    this.showForm.set(true);
  }

  openCreateLayout(): void {
    this.editingRoomLayout.set(null);
    this.modal.set('layout');
    this.showForm.set(true);
  }

  openEditLayout(layout: AdminRoomLayout): void {
    this.editingRoomLayout.set(layout);
    this.modal.set('layout');
    this.showForm.set(true);
  }

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

  toggleTypeActive(roomType: AdminRoomType): void {
    this.toggling.set(roomType.id);
    this.adminService.toggleRoomTypeStatus(roomType.id).subscribe({
      next: (updated) => {
        this.roomTypes.update((list) =>
          list.map((item) => (item.id === updated.id ? updated : item)),
        );
        this.toggling.set(null);
      },
      error: () => this.toggling.set(null),
    });
  }

  toggleLayoutActive(layout: AdminRoomLayout): void {
    this.toggling.set(layout.id);
    this.adminService.toggleRoomLayoutStatus(layout.id).subscribe({
      next: (updated) => {
        this.roomLayouts.update((list) =>
          list.map((item) => (item.id === updated.id ? updated : item)),
        );
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

  onTypeSaved(roomType: AdminRoomType): void {
    this.roomTypes.update((list) => {
      const index = list.findIndex((item) => item.id === roomType.id);
      return index >= 0
        ? list.map((item) => (item.id === roomType.id ? roomType : item))
        : [...list, roomType];
    });
    this.showForm.set(false);
  }

  onLayoutSaved(layout: AdminRoomLayout): void {
    this.roomLayouts.update((list) => {
      const index = list.findIndex((item) => item.id === layout.id);
      return index >= 0
        ? list.map((item) => (item.id === layout.id ? layout : item))
        : [...list, layout];
    });
    this.showForm.set(false);
  }
}
