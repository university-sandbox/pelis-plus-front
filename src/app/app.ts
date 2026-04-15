import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CartSidebarComponent } from './features/cart/cart-sidebar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CartSidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
