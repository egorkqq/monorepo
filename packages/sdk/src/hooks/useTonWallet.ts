import { useMemo } from "react";

import { useAtomValue } from "jotai";

import { activeWalletAtom } from "../state/keys";
import { getWalletContract } from "../utils/getWalletContract";
import { useNetwork } from "./useNetwork";

export const useTonWallet = () => {
  const walletInfo = useAtomValue(activeWalletAtom);
  const { network } = useNetwork();

  return useMemo(() => {
    if (!walletInfo) return undefined;

    const walletContract = getWalletContract(walletInfo.walletVersion).create({
      workchain: 0,
      publicKey: Buffer.from(walletInfo.publicKey, "hex"),
    });

    const walletAddress = walletContract.address.toString({ testOnly: network === "testnet", bounceable: false });

    return {
      id: walletInfo?.id,
      publicKey: walletInfo?.publicKey,
      encodedMnemonics: walletInfo?.encodedMnemonics,
      walletVersion: walletInfo?.walletVersion,

      address: walletAddress,
      contract: walletContract,
    };
  }, [walletInfo, network]);
};
