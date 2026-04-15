import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideAngularModule, QrCode, MapPin, Clock, Calendar, Armchair, Film } from 'lucide-angular';

import { type Ticket } from '../../core/models/ticket.model';

@Component({
  selector: 'app-ticket',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="overflow-hidden rounded-2xl"
      style="background: var(--color-surface); border: 1px solid var(--color-border); box-shadow: var(--shadow-card);"
      [attr.aria-label]="'Entrada para ' + ticket().movie"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between gap-4 px-5 py-4"
        style="background: var(--color-surface-raised); border-bottom: 1px solid var(--color-border);"
      >
        <div>
          <p class="text-xs font-semibold uppercase tracking-widest" style="color: var(--color-accent);">Entrada digital</p>
          <h3 class="mt-0.5 text-base font-bold leading-tight" style="color: var(--color-text-primary);">{{ ticket().movie }}</h3>
        </div>
        <div class="text-right">
          <p class="text-xs" style="color: var(--color-text-secondary);">Código</p>
          <p class="font-mono text-sm font-bold" style="color: var(--color-text-primary);">{{ ticket().bookingCode }}</p>
        </div>
      </div>

      <!-- Dashed divider -->
      <div class="relative py-2">
        <div class="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 rounded-r-full" style="background: var(--color-bg);"></div>
        <div class="border-t border-dashed" style="border-color: var(--color-border-strong); margin: 0 20px;"></div>
        <div class="absolute right-0 top-1/2 h-5 w-5 -translate-y-1/2 rounded-l-full" style="background: var(--color-bg);"></div>
      </div>

      <!-- Details grid -->
      <div class="grid grid-cols-2 gap-4 px-5 pb-4">
        <div>
          <p class="mb-0.5 flex items-center gap-1 text-xs" style="color: var(--color-text-secondary);">
            <lucide-icon [img]="Calendar" [size]="11" aria-hidden="true" />
            Fecha
          </p>
          <p class="text-sm font-semibold" style="color: var(--color-text-primary);">{{ ticket().date }}</p>
        </div>
        <div>
          <p class="mb-0.5 flex items-center gap-1 text-xs" style="color: var(--color-text-secondary);">
            <lucide-icon [img]="Clock" [size]="11" aria-hidden="true" />
            Hora
          </p>
          <p class="text-sm font-semibold" style="color: var(--color-text-primary);">{{ ticket().time }}</p>
        </div>
        <div>
          <p class="mb-0.5 flex items-center gap-1 text-xs" style="color: var(--color-text-secondary);">
            <lucide-icon [img]="MapPin" [size]="11" aria-hidden="true" />
            Cine
          </p>
          <p class="text-sm font-semibold" style="color: var(--color-text-primary);">{{ ticket().venue }}</p>
        </div>
        <div>
          <p class="mb-0.5 flex items-center gap-1 text-xs" style="color: var(--color-text-secondary);">
            <lucide-icon [img]="Armchair" [size]="11" aria-hidden="true" />
            Asiento
          </p>
          <p class="text-sm font-semibold" style="color: var(--color-text-primary);">{{ ticket().seat }}</p>
        </div>
        <div>
          <p class="mb-0.5 flex items-center gap-1 text-xs" style="color: var(--color-text-secondary);">
            <lucide-icon [img]="Film" [size]="11" aria-hidden="true" />
            Sala / Formato
          </p>
          <p class="text-sm font-semibold" style="color: var(--color-text-primary);">{{ ticket().room }} · {{ ticket().format.toUpperCase() }}</p>
        </div>
        <div>
          <p class="mb-0.5 text-xs" style="color: var(--color-text-secondary);">Total pagado</p>
          <p class="text-sm font-semibold" style="color: var(--color-text-primary);">S/ {{ ticket().totalPaid }}</p>
        </div>
      </div>

      <!-- QR code area -->
      <div
        class="flex flex-col items-center justify-center gap-2 border-t px-5 py-5"
        style="border-color: var(--color-border);"
      >
        <div
          class="flex h-28 w-28 items-center justify-center rounded-xl"
          style="background: var(--color-surface-raised);"
          role="img"
          [attr.aria-label]="'Código QR: ' + ticket().bookingCode"
        >
          <lucide-icon [img]="QrCode" [size]="80" style="color: var(--color-text-primary);" aria-hidden="true" />
        </div>
        <p class="font-mono text-xs" style="color: var(--color-text-secondary);">{{ ticket().qrData }}</p>
        <p class="text-center text-xs" style="color: var(--color-text-disabled);">Muestra este código en el cine</p>
      </div>
    </article>
  `,
})
export class TicketComponent {
  readonly ticket = input.required<Ticket>();

  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly MapPin = MapPin;
  readonly Armchair = Armchair;
  readonly Film = Film;
  readonly QrCode = QrCode;
}
