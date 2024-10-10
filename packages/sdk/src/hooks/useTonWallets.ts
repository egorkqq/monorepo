import { useCallback, useMemo } from "react";

import { type UUID } from "crypto";

import { mnemonicToPrivateKey } from "@ton/crypto";
import { useAtom } from "jotai";

import { activeWalletIdAtom, storedWalletsAtom, walletsCounterAtom } from "../state/keys";
import { getWalletContract } from "../utils/getWalletContract";
import { encodePrivateKeyByPin } from "../utils/pincode";

export const useTonWallets = () => {
  const [wallets, setWallets] = useAtom(storedWalletsAtom);
  const [walletsCounter, setWalletsCounter] = useAtom(walletsCounterAtom);
  const [activeWalletId, setAtiveWalletId] = useAtom(activeWalletIdAtom);

  const selectWallet = useCallback((id: UUID | undefined) => {
    setAtiveWalletId(id);
  }, []);

  const disconnectWallet = useCallback(
    (id: UUID) => {
      const newWallets = wallets.filter((wallet) => wallet.id !== id);

      setWallets(newWallets);

      if (activeWalletId === id) {
        selectWallet(newWallets[0]?.id);
      }
    },
    [activeWalletId, wallets],
  );

  const addWallet = useCallback(
    async (mnemonics: string[], pin: string, walletVersion: "V4" | "V5R1" = "V5R1") => {
      const keyPair = await mnemonicToPrivateKey(mnemonics);
      const encodedMnemonics = encodePrivateKeyByPin(mnemonics, pin);

      const walletContract = getWalletContract(walletVersion).create({
        workchain: 0,
        publicKey: keyPair.publicKey,
      });

      const walletAddress = walletContract.address.toString();
      const alreadyExistsId = wallets.find((wallet) => wallet.address === walletAddress)?.id;

      if (alreadyExistsId) {
        selectWallet(alreadyExistsId);

        return;
      }

      const id = crypto.randomUUID();
      setWalletsCounter((prev) => prev + 1);

      const wallet = {
        id,
        address: walletContract.address.toString(),
        publicKey: keyPair.publicKey.toString("hex"),
        encodedMnemonics,
        walletVersion,
        walletName: `Wallet ${walletsCounter}`,
      };

      selectWallet(id);

      setWallets((prev) => [...prev, wallet]);
    },
    [wallets.length, walletsCounter],
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
