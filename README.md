# Angular Frontend Template

Production-ready Angular boilerplate with SSR, Tailwind CSS v4, Angular Material, Playwright e2e, and `.env`-driven entry routing.

## Stack

- Angular `21` (standalone components, SSR enabled)
- TypeScript `5.9` (strict mode)
- Tailwind CSS `4` (`@import 'tailwindcss'` + `@source` scanning)
- Angular Material `21` (Material 3 theming)
- RxJS `7`
- Vitest (unit tests via Angular builder)
- Playwright (e2e)
- ESLint + Prettier
- Bun lockfile included (`bun.lock`)

## Requirements

- Node.js `>= 20.19` (Angular CLI requirement)
- Bun `>= 1.x` (optional, for faster installs/runs)

## Commands

### Bun

```bash
bun install
bun run start
bun run build
bun run watch
bun run test
bun run e2e
bun run lint
bun run lint:fix
bun run format
bun run format:check
```

### NPM (equivalent)

```bash
npm install
npm run start
npm run build
npm run watch
npm run test
npm run e2e
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

## Project Structure

```text
src/
  app/
    app.config.ts                 # Browser providers (router, hydration, animations)
    app.routes.ts                 # Lazy routes + env-driven index redirect
    core/
      interceptors/               # HTTP interceptors
      services/
        auth.service.ts           # Simple local auth state service
    features/
      auth/                       # Login feature page
      landing/                    # Starter landing page
    shared/
      layouts/
        page-shell/               # Reusable white page shell layout
  environments/
    environment.ts                # Reads values directly from .env
  material-theme.scss             # Material 3 theme tokens
  styles.css                      # Tailwind v4 setup + base reset layer
```

## How Routing Works

The default route `/` is selected from env:

```ts
app: {
  indexPage: 'login' | 'landing';
}
```

- Development and production both use the same `environment.ts`.

## Environment Variables Used by Template

Copy `.env.example` to `.env` and adjust values for your project.
Angular reads these values directly using `import.meta.env`.
Use npm scripts (`npm start`, `npm run build`, etc.) so `.env` is loaded automatically before Angular CLI runs.

```ts
app: {
  name: string;            // Brand/app label used in pages
  indexPage: 'login' | 'landing';
  postLoginRoute: string;  // Where to navigate after successful login
}

backend: {
  baseUrl: string;         // Backend API base URL
}

auth: {
  demoEmail: string;       // Demo login email
  demoPassword: string;    // Demo login password
  tokenStorageKey: string; // localStorage key for mock token
}
```

Important: Angular client variables must use the `NG_APP_` prefix.

Additional runtime variables:

- `PORT` (SSR server port, default `4000`)
- `PLAYWRIGHT_TEST_BASE_URL` (Playwright base URL, default `http://localhost:4200`)
- `CI` (optional CI flag for Playwright retries/workers)

## UI/Styling Architecture

- Tailwind utilities are used in templates for layout and spacing.
- Angular Material components are used for controls (`mat-form-field`, `mat-input`, `mat-button`, `mat-card`).
- `src/styles.css` contains a small reset in `@layer base` to avoid style conflicts and keep behavior predictable.
- `src/material-theme.scss` defines Material design tokens for consistent component theming.

## Starter Features Included

- Functional login form with validation and mock auth flow
- Landing page ready to be replaced by your first real feature
- Reusable page shell layout to speed up page creation
- Lazy-loaded routes for `login` and `landing`

## Recommended First Edits

1. Copy `.env.example` to `.env`, then update app/auth values there.
2. Replace demo auth in `auth.service.ts` with your real API integration.
3. Add feature folders under `src/app/features/` and register lazy routes in `app.routes.ts`.
4. Keep shared/reusable UI in `src/app/shared` and domain logic in `src/app/core`.

## Notes

- If build fails with Node version errors, upgrade Node to `20.19+`.
- SSR entrypoints are already wired (`main.server.ts`, `server.ts`, `app.config.server.ts`).
