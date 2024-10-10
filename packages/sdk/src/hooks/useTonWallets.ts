import { useCallback, useMemo } from "react";

import { type UUID } from "crypto";

import { mnemonicToPrivateKey } from "@ton/crypto";
import { useAtom, useSetAtom } from "jotai";

import { activeWalletIdAtom, storedWalletsAtom } from "../state/keys";
import { encodePrivateKeyByPin } from "../utils/pincode";

export const useTonWallets = () => {
  const [wallets, setWallets] = useAtom(storedWalletsAtom);
  const setAtiveWalletId = useSetAtom(activeWalletIdAtom);

  const disconnectWallet = useCallback((id: UUID) => {
    setWallets((prev) => prev.filter((wallet) => wallet.id !== id));
  }, []);

  const selectWallet = useCallback((id: UUID) => {
    setAtiveWalletId(id);
  }, []);

  const addWallet = useCallback(
    async (mnemonics: string[], pin: string, walletVersion: "V4" | "V5R1" = "V5R1") => {
      const keyPair = await mnemonicToPrivateKey(mnemonics);
      const id = crypto.randomUUID();
      const encodedMnemonics = encodePrivateKeyByPin(mnemonics, pin);

      const wallet = {
        id,
        publicKey: keyPair.publicKey.toString("hex"),
        encodedMnemonics,
        walletVersion,
      };

      if (wallets.length === 0) {
        setAtiveWalletId(id);
      }

      setWallets((prev) => [...prev, wallet]);
    },
    [wallets.length],
  );

  return useMemo(
    () => ({
      disconnectWallet,
      selectWallet,
      addWallet,
      list: wallets,
    }),
    [disconnectWallet, selectWallet, addWallet, wallets],
  );
};
