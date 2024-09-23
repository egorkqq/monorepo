import { type UUID } from "crypto";

import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai/vanilla";

import { StorageKeys } from "@/const/storageKeys";

export const ConnectionTypes = {
  TonConnect: "TonConnect",
  SDK: "SDK",
  NotConnected: "NotConnected",
} as const;

export type ConnectionType = (typeof ConnectionTypes)[keyof typeof ConnectionTypes];

// TON Connect Wallet максимум может быть один
export interface UserWallet {
  id: UUID;
  connectionType: ConnectionType;
  network: string;
  address: string;
  publicKey?: string;
  privateKey?: string;
}

export const userWalletsAtom = atomWithStorage<UserWallet[]>(StorageKeys.UserWallets, []);
export const activeUserWalletIdAtom = atomWithStorage<UUID | undefined>(StorageKeys.ActiveUserWalletId, undefined);

export const activeUserWalletAtom = atom<UserWallet | undefined>((get) => {
  const userWallets = get(userWalletsAtom);
  const activeUserWalletId = get(activeUserWalletIdAtom);

  return userWallets.find((wallet) => wallet.id === activeUserWalletId);
});

// user: in our backend, has wallets

// wallets of user = [wallet1, wallet2, wallet3]
// wallet: {connectionType, network, address, publickKey, privateKey}
