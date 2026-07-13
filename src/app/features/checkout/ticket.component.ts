import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import type { OnChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  LucideAngularModule,
  MapPin,
  Clock,
  Calendar,
  Armchair,
  Film,
  Download,
  AlertCircle,
  Mail,
} from 'lucide-angular';

import { type Ticket } from '../../core/models/ticket.model';
import { OrderService } from '../../core/services/order.service';
import { PelisToastService } from '../../shared/services/pelis-toast.service';

type QrDataUrlGenerator = (
  text: string,
  options: {
    width: number;
    margin: number;
    errorCorrectionLevel: 'M';
    color: { dark: string; light: string };
  },
) => Promise<string>;

@Component({
  selector: 'app-ticket',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ticket.component.html',
})
export class TicketComponent implements OnChanges {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly toast = inject(PelisToastService);
  private readonly orderService = inject(OrderService);
  private qrGenerationId = 0;

  readonly ticket = input.required<Ticket>();
  readonly qrDataUrl = signal<string | null>(null);
  readonly qrLoadFailed = signal(false);
  readonly downloadingPdf = signal(false);
  readonly sendingTestEmail = signal(false);

  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly MapPin = MapPin;
  readonly Armchair = Armchair;
  readonly Film = Film;
  readonly Download = Download;
  readonly AlertCircle = AlertCircle;
  readonly Mail = Mail;

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

    const generationId = ++this.qrGenerationId;
    const data = this.ticket().qrData || this.ticket().bookingCode;
    this.qrDataUrl.set(null);
    this.qrLoadFailed.set(false);

    if (!data) {
      this.qrLoadFailed.set(true);
      return;
    }

    // Keep this browser-only: qrcode uses the browser canvas renderer.
    import('qrcode')
      .then((module) => {
        // The package is CommonJS. Depending on the production bundler it can be
        // exposed either as named exports or below `default`.
        const qrModule = module as unknown as {
          toDataURL?: QrDataUrlGenerator;
          default?: { toDataURL?: QrDataUrlGenerator };
        };
        const toDataURL = qrModule.toDataURL ?? qrModule.default?.toDataURL;
        if (!toDataURL) {
          throw new Error('El generador de código QR no está disponible.');
        }

        return toDataURL(data, {
          width: 200,
          margin: 1,
          errorCorrectionLevel: 'M',
          color: { dark: '#000000', light: '#ffffff' },
        });
      })
      .then((url) => {
        if (generationId !== this.qrGenerationId) return;
        this.qrDataUrl.set(url);
      })
      .catch((error: unknown) => {
        if (generationId !== this.qrGenerationId) return;
        this.qrLoadFailed.set(true);
        console.error('No se pudo generar el código QR de la entrada.', error);
      });
  }

  async downloadTicketPdf(): Promise<void> {
    const url = this.qrDataUrl();
    if (!url || !isPlatformBrowser(this.platformId) || this.downloadingPdf()) return;

    this.downloadingPdf.set(true);
    try {
      const pdf = await this.createTicketPdf(url);
      const objectUrl = URL.createObjectURL(pdf);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `entrada-${this.ticket().bookingCode}.pdf`;
      link.style.display = 'none';
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000);
    } catch (error) {
      console.error('No se pudo descargar el ticket en PDF.', error);
      this.toast.show('No se pudo generar el ticket en PDF. Inténtalo nuevamente.', 'error');
    } finally {
      this.downloadingPdf.set(false);
    }
  }

  sendTestEmail(): void {
    if (this.sendingTestEmail()) return;

    this.sendingTestEmail.set(true);
    this.orderService.resendConfirmationEmail(this.ticket().orderId).subscribe({
      next: () => {
        this.sendingTestEmail.set(false);
        this.toast.info('Correo de prueba solicitado. Revisa los logs del backend para el resultado.');
      },
      error: (error: unknown) => {
        this.sendingTestEmail.set(false);
        console.error('No se pudo solicitar el correo de prueba.', error);
        this.toast.show('No se pudo solicitar el correo de prueba.', 'error');
      },
    });
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
