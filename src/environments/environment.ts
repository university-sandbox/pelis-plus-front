import { ENV } from './env-vars';
import type { AppEnvironment, IndexPage } from './environment.model';
import { z } from 'zod';

const commonEnvSchema = z.object({
  NG_APP_PRODUCTION: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  NG_APP_NAME: z.string().min(1),
  NG_APP_INDEX_PAGE: z.string().min(1),
  NG_APP_POST_LOGIN_ROUTE: z.string().min(1),
  NG_APP_BACKEND_BASE_URL: z.string().url(),
  // TMDB — used while the real backend is not yet available
  NG_APP_TMDB_BASE_URL: z.string().url().default('https://api.themoviedb.org/3'),
  NG_APP_TMDB_IMAGE_BASE_URL: z.string().url().default('https://image.tmdb.org/t/p'),
  NG_APP_TMDB_ACCESS_TOKEN: z.string().min(1),
  NG_APP_AUTH_DEMO_EMAIL: z.string().min(1),
  NG_APP_AUTH_DEMO_PASSWORD: z.string().min(1),
  NG_APP_AUTH_TOKEN_STORAGE_KEY: z.string().min(1),
  NG_APP_MOCK_ENABLED: z
    .enum(['true', 'false'])
    .default('true')
    .transform((v) => v === 'true'),
});

// In SSR (Node.js), process.env holds runtime values and takes precedence.
// In the browser, values come from env-vars.ts which is generated at build time
// by scripts/generate-env-ts.mjs from the .env file.
function readEnv(key: string): string | undefined {
  if (typeof process !== 'undefined') {
    const value = process.env[key];
    if (value !== undefined) return value;
  }
  return ENV[key];
}

const runtimeEnv = {
  NG_APP_PRODUCTION: readEnv('NG_APP_PRODUCTION'),
  NG_APP_NAME: readEnv('NG_APP_NAME'),
  NG_APP_INDEX_PAGE: readEnv('NG_APP_INDEX_PAGE'),
  NG_APP_POST_LOGIN_ROUTE: readEnv('NG_APP_POST_LOGIN_ROUTE'),
  NG_APP_BACKEND_BASE_URL: readEnv('NG_APP_BACKEND_BASE_URL'),
  NG_APP_TMDB_BASE_URL: readEnv('NG_APP_TMDB_BASE_URL'),
  NG_APP_TMDB_IMAGE_BASE_URL: readEnv('NG_APP_TMDB_IMAGE_BASE_URL'),
  NG_APP_TMDB_ACCESS_TOKEN: readEnv('NG_APP_TMDB_ACCESS_TOKEN'),
  NG_APP_AUTH_DEMO_EMAIL: readEnv('NG_APP_AUTH_DEMO_EMAIL'),
  NG_APP_AUTH_DEMO_PASSWORD: readEnv('NG_APP_AUTH_DEMO_PASSWORD'),
  NG_APP_AUTH_TOKEN_STORAGE_KEY: readEnv('NG_APP_AUTH_TOKEN_STORAGE_KEY'),
  NG_APP_MOCK_ENABLED: readEnv('NG_APP_MOCK_ENABLED'),
};
const parsedEnv = commonEnvSchema.safeParse(runtimeEnv);
if (!parsedEnv.success) {
  const details = parsedEnv.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('; ');
  throw new Error(`Invalid environment configuration: ${details}`);
}

function getIndexPageEnv(value: string): IndexPage {
  if (value === 'catalog' || value === 'landing' || value === 'login') {
    return value;
  }
  throw new Error(`Invalid NG_APP_INDEX_PAGE: "${value}". Allowed values are "catalog", "landing", or "login".`);
}

export const environment: AppEnvironment = {
  production: parsedEnv.data.NG_APP_PRODUCTION,
  app: {
    name: parsedEnv.data.NG_APP_NAME,
    indexPage: getIndexPageEnv(parsedEnv.data.NG_APP_INDEX_PAGE),
    postLoginRoute: parsedEnv.data.NG_APP_POST_LOGIN_ROUTE,
  },
  backend: {
    baseUrl: parsedEnv.data.NG_APP_BACKEND_BASE_URL,
  },
  tmdb: {
    baseUrl: parsedEnv.data.NG_APP_TMDB_BASE_URL,
    imageBaseUrl: parsedEnv.data.NG_APP_TMDB_IMAGE_BASE_URL,
    accessToken: parsedEnv.data.NG_APP_TMDB_ACCESS_TOKEN,
  },
  auth: {
    demoEmail: parsedEnv.data.NG_APP_AUTH_DEMO_EMAIL,
    demoPassword: parsedEnv.data.NG_APP_AUTH_DEMO_PASSWORD,
    tokenStorageKey: parsedEnv.data.NG_APP_AUTH_TOKEN_STORAGE_KEY,
  },
  mock: {
    enabled: parsedEnv.data.NG_APP_MOCK_ENABLED,
  },
};
