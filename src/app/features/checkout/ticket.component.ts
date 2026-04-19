import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnChanges,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LucideAngularModule, MapPin, Clock, Calendar, Armchair, Film, Download } from 'lucide-angular';

import { type Ticket } from '../../core/models/ticket.model';

@Component({
  selector: 'app-ticket',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ticket.component.html',
})
export class TicketComponent implements OnChanges {
  private readonly platformId = inject(PLATFORM_ID);

  readonly ticket = input.required<Ticket>();
  readonly qrDataUrl = signal<string | null>(null);

  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly MapPin = MapPin;
  readonly Armchair = Armchair;
  readonly Film = Film;
  readonly Download = Download;

  constructor() {
    afterNextRender(() => {
      this.generateQr();
    });
  }

  ngOnChanges(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.generateQr();
    }
  }

  private generateQr(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const data = this.ticket().qrData || this.ticket().bookingCode;
    if (!data) return;

    // Dynamically import qrcode to avoid SSR issues
    import('qrcode').then(({ toDataURL }) => {
      toDataURL(data, {
        width: 200,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' },
      }).then((url) => {
        this.qrDataUrl.set(url);
      }).catch(() => {
        // QR generation failed — leave placeholder
      });
    }).catch(() => {
      // qrcode not available
    });
  }

  downloadQr(): void {
    const url = this.qrDataUrl();
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `entrada-${this.ticket().bookingCode}.png`;
    a.click();
  }
}
