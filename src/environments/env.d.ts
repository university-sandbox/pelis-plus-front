interface ImportMetaEnv {
  readonly NG_APP_PRODUCTION: string | undefined;
  readonly NG_APP_NAME: string | undefined;
  readonly NG_APP_INDEX_PAGE: string | undefined;
  readonly NG_APP_POST_LOGIN_ROUTE: string | undefined;
  readonly NG_APP_BACKEND_BASE_URL: string | undefined;
  readonly NG_APP_AUTH_DEMO_EMAIL: string | undefined;
  readonly NG_APP_AUTH_DEMO_PASSWORD: string | undefined;
  readonly NG_APP_AUTH_TOKEN_STORAGE_KEY: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
