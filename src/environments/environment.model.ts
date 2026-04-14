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
  tmdb: {
    /** https://api.themoviedb.org/3 */
    baseUrl: string;
    /** https://image.tmdb.org/t/p */
    imageBaseUrl: string;
    /** Bearer token from TMDB developer dashboard */
    accessToken: string;
  };
  auth: {
    demoEmail: string;
    demoPassword: string;
    tokenStorageKey: string;
  };
  mock: {
    /** When true, service methods return fake data instead of calling the backend. */
    enabled: boolean;
  };
}
