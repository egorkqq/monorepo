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
  index: "/",
  "add-wallet": "/register/add-wallet",
  "secret-key": "/register/secret-key",
  "confirm-secret-key": "/register/confirm-secret-key",
  finish: "/register/finish",
  existing: "/register/existing",
} as const;

export const DepositRoute = {
  index: "/",
  external: "/external",
} as const;

export const CatalogRoute = {
  index: "/",
  game: "/:id",
  leaders: "/:id/leaders",
  category: "/category/:id",
} as const;

export const BankRoute = {
  index: "/",
  tasks: "/tasks",
  stake: "/stake",
  buy: "/buy",
  history: "/stake/history",
} as const;

export const any = (route: string): string => `${route}/*`;

export const relative = (path: string): string => `.${path}`;
