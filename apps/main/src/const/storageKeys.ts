export const StorageKeys = {
  UserWallets: "UserWallets",
  ActiveUserWalletId: "ActiveUserWalletId",
  ActiveUserWallet: "ActiveUserWallet",
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
