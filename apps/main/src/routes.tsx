export const AppRoute = {
  register: "/register",
  settings: "/settings",
  catalog: "/catalog",
  news: "/news",
  deposit: "/deposit",
  bank: "/bank",
  swap: "/swap",
  send: "/send",
  market: "/market",
  home: "/",
} as const;

export const RegisterRoute = {
  index: AppRoute.register,
  "add-wallet": `${AppRoute.register}/add-wallet`,
  "secret-key": `${AppRoute.register}/secret-key`,
  "confirm-secret-key": `${AppRoute.register}/confirm-secret-key`,
  finish: `${AppRoute.register}/finish`,
  existing: `${AppRoute.register}/existing`,
} as const;

export const DepositRoute = {
  index: AppRoute.deposit,
  external: `${AppRoute.deposit}/external`,
} as const;

export const CatalogRoute = {
  index: AppRoute.catalog,
  game: `${AppRoute.catalog}/:id`,
  leaders: `${AppRoute.catalog}/:id/leaders`,
  category: `${AppRoute.catalog}/category/:id`,
} as const;

export const BankRoute = {
  index: "/",
  tasks: `${AppRoute.bank}/tasks`,
  stake: `${AppRoute.bank}/stake`,
  buy: `${AppRoute.bank}/buy`,
  history: `${AppRoute.bank}/stake/history`,
} as const;

export const any = (route: string): string => `${route}/*`;

export const relative = (path: string): string => `.${path}`;
