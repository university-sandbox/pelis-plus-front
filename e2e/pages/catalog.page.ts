import { type Locator, type Page } from '@playwright/test';

import { BasePage } from './base.page';

export class CatalogPage extends BasePage {
  readonly searchInput: Locator;
  readonly genrePills: Locator;
  readonly nowPlayingSection: Locator;
  readonly upcomingSection: Locator;
  readonly popularSection: Locator;
  readonly heroSection: Locator;
  readonly navbar: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByRole('searchbox', { name: /buscar/i });
    this.genrePills = page.getByRole('listbox', { name: /filtrar por género/i });
    this.nowPlayingSection = page.getByRole('region', { name: /en cartelera/i });
    this.upcomingSection = page.getByRole('region', { name: /próximos estrenos/i });
    this.popularSection = page.getByRole('region', { name: /populares/i });
    this.heroSection = page.getByRole('region', { name: /película destacada/i });
    this.navbar = page.locator('app-navbar');
  }

  async goto(): Promise<void> {
    await this.page.goto('/catalog');
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  async selectGenre(name: string): Promise<void> {
    await this.genrePills.getByRole('option', { name }).click();
  }

  async getMovieCards(): Promise<Locator> {
    return this.page.locator('app-movie-card');
  }
}
