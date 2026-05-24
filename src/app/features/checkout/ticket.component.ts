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
import {
  LucideAngularModule,
  MapPin,
  Clock,
  Calendar,
  Armchair,
  Film,
  Download,
} from 'lucide-angular';

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
    import('qrcode')
      .then(({ toDataURL }) => {
        toDataURL(data, {
          width: 200,
          margin: 1,
          color: { dark: '#000000', light: '#ffffff' },
        })
          .then((url) => {
            this.qrDataUrl.set(url);
          })
          .catch(() => {
            // QR generation failed — leave placeholder
          });
      })
      .catch(() => {
        // qrcode not available
      });
  }

  async downloadQr(): Promise<void> {
    const url = this.qrDataUrl();
    if (!url || !isPlatformBrowser(this.platformId)) return;

    const pdf = await this.createTicketPdf(url);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(pdf);
    a.download = `entrada-${this.ticket().bookingCode}.pdf`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  private async createTicketPdf(qrDataUrl: string): Promise<Blob> {
    const ticket = this.ticket();
    const qrImage = await this.toJpegImage(qrDataUrl);
    const fields = [
      ['Codigo', ticket.bookingCode],
      ['Cliente', ticket.userName],
      ['Pelicula', ticket.movie],
      ['Fecha', ticket.date],
      ['Hora', ticket.time],
      ['Cine', ticket.venue],
      ['Sala', ticket.room],
      ['Butaca', ticket.seat],
      ['Formato', ticket.format.toUpperCase()],
      ['Total pagado', `S/ ${ticket.totalPaid}`],
      ['Orden', ticket.orderId],
      ['Emitida', ticket.issuedAt],
      ['QR', ticket.qrData],
    ];

    const content = [
      '0.06 0.08 0.1 rg',
      '0 782 595 60 re f',
      '1 1 1 rg',
      '/F1 20 Tf',
      `BT 40 812 Td (${this.pdfText('Entrada digital')}) Tj ET`,
      '/F1 11 Tf',
      `BT 40 794 Td (${this.pdfText('PelisPlus')}) Tj ET`,
      '0.93 0.16 0.18 rg',
      '40 746 515 3 re f',
      '0.08 0.08 0.08 rg',
      '/F1 18 Tf',
      `BT 40 710 Td (${this.pdfText(ticket.movie, 48)}) Tj ET`,
      '/F1 11 Tf',
      `BT 40 690 Td (${this.pdfText(`Codigo: ${ticket.bookingCode}`)}) Tj ET`,
      'q',
      '1 1 1 rg',
      '405 565 130 130 re f',
      `130 0 0 130 405 565 cm /QR Do`,
      'Q',
      '/F1 9 Tf',
      `BT 406 550 Td (${this.pdfText('Muestra este codigo en el cine')}) Tj ET`,
      ...fields.flatMap(([label, value], index) => {
        const y = 650 - index * 24;
        return [
          '0.42 0.42 0.42 rg',
          '/F1 9 Tf',
          `BT 40 ${y} Td (${this.pdfText(label)}) Tj ET`,
          '0.08 0.08 0.08 rg',
          '/F1 12 Tf',
          `BT 150 ${y} Td (${this.pdfText(value, 52)}) Tj ET`,
        ];
      }),
      '0.42 0.42 0.42 rg',
      '/F1 9 Tf',
      `BT 40 42 Td (${this.pdfText('Conserva este PDF. La entrada sera validada con el codigo QR.')}) Tj ET`,
    ].join('\n');

    return this.buildPdf(content, qrImage);
  }

  private async toJpegImage(
    dataUrl: string,
  ): Promise<{ data: string; width: number; height: number }> {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('No se pudo preparar el QR.'));
      img.src = dataUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('No se pudo preparar el PDF.');
    }

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0);

    return {
      data: atob(canvas.toDataURL('image/jpeg', 0.95).split(',')[1] ?? ''),
      width: canvas.width,
      height: canvas.height,
    };
  }

  private buildPdf(
    content: string,
    qrImage: { data: string; width: number; height: number },
  ): Blob {
    const objects = [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      [
        '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842]',
        '/Resources << /Font << /F1 4 0 R >> /XObject << /QR 6 0 R >> >>',
        '/Contents 5 0 R >>',
      ].join(' '),
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
      `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
      [
        `<< /Type /XObject /Subtype /Image /Width ${qrImage.width} /Height ${qrImage.height}`,
        '/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode',
        `/Length ${qrImage.data.length} >>\nstream\n${qrImage.data}\nendstream`,
      ].join(' '),
    ];

    let pdf = '%PDF-1.4\n';
    const offsets = [0];

    objects.forEach((object, index) => {
      offsets.push(pdf.length);
      pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });

    const xrefStart = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += '0000000000 65535 f \n';
    offsets.slice(1).forEach((offset) => {
      pdf += `${offset.toString().padStart(10, '0')} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
    pdf += `startxref\n${xrefStart}\n%%EOF`;

    return new Blob([this.toBytes(pdf)], { type: 'application/pdf' });
  }

  private pdfText(value: string, maxLength = 90): string {
    return this.escapePdfText(this.toAscii(value).slice(0, maxLength));
  }

  private toAscii(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\x20-\x7E]/g, '?');
  }

  private escapePdfText(value: string): string {
    return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  }

  private toBytes(value: string): ArrayBuffer {
    const buffer = new ArrayBuffer(value.length);
    const bytes = new Uint8Array(buffer);

    for (let index = 0; index < value.length; index += 1) {
      bytes[index] = value.charCodeAt(index) & 0xff;
    }

    return buffer;
  }
}
