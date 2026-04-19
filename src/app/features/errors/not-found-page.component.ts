import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Film, Home, Search } from 'lucide-angular';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './not-found-page.component.html',
})
export class NotFoundPageComponent {
  readonly Film = Film;
  readonly Home = Home;
  readonly Search = Search;
}
