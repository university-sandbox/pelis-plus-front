import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-page-shell',
  imports: [MatCardModule],
  templateUrl: './page-shell.component.html',
  styleUrl: './page-shell.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageShellComponent {
  readonly brandName = input.required<string>();
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
}
