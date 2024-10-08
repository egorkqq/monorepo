import { type UUID } from "crypto";

import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface UserWallet {
  id: UUID;
  publicKey: string;
  mnemonics: string[]; // TODO: privateHashedKey via PIN
  walletVersion: "V4" | "V5R1";
}

export const storedWalletsAtom = atomWithStorage<UserWallet[]>("@arc/sdk/userWallets", [], undefined, {
  getOnInit: true,
});

export const activeWalletIdAtom = atomWithStorage<UUID | undefined>(
  "@arc/sdk/activeUserWalletId",
  undefined,
  undefined,
  { getOnInit: true },
);

export const activeWalletAtom = atom<UserWallet | undefined>((get) => {
  const storedWallets = get(storedWalletsAtom);
  const activeWalletId = get(activeWalletIdAtom);

  return storedWallets.find((wallet) => wallet.id === activeWalletId);
});
