export type IndexPage = 'catalog' | 'landing' | 'login';

export interface AppEnvironment {
  production: boolean;
  app: {
    name: string;
    indexPage: IndexPage;
    postLoginRoute: string;
  };
  backend: {
    baseUrl: string;
  };
  auth: {
    demoEmail: string;
    demoPassword: string;
    mvpAccountsUnlock: string;
    tokenStorageKey: string;
  };
}
