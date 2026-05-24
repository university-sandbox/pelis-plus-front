import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  PelisToastComponent,
  type PelisToastData,
  type PelisToastVariant,
} from '../components/pelis-toast/pelis-toast.component';

@Injectable({ providedIn: 'root' })
export class PelisToastService {
  private readonly snackBar = inject(MatSnackBar);

  show(message: string, variant: PelisToastVariant = 'info'): void {
    this.snackBar.openFromComponent(PelisToastComponent, {
      data: { message, variant } satisfies PelisToastData,
      duration: 5200,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      politeness: variant === 'error' ? 'assertive' : 'polite',
      panelClass: ['pelis-toast-panel'],
    });
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }
}
