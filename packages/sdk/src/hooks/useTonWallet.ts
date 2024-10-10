import { useMemo } from "react";

import { Address } from "@ton/core";
import { useAtomValue } from "jotai";

import { activeWalletAtom } from "../state/keys";
import { useNetwork } from "./useNetwork";

export const useTonWallet = () => {
  const walletInfo = useAtomValue(activeWalletAtom);
  const { network } = useNetwork();

  return useMemo(() => {
    if (!walletInfo) return undefined;

    const walletAddress = Address.parse(walletInfo.address).toString({
      testOnly: network === "testnet",
      bounceable: false,
    });

    return {
      id: walletInfo?.id,
      publicKey: walletInfo?.publicKey,
      encodedMnemonics: walletInfo?.encodedMnemonics,
      walletVersion: walletInfo?.walletVersion,
      walletName: walletInfo?.walletName,
      address: walletAddress,
    };
  }, [walletInfo, network]);
};
