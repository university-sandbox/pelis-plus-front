export type IndexPage = 'login' | 'landing';

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
    tokenStorageKey: string;
  };
}
