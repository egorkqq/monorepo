import { useQuery } from "@tanstack/react-query";
import { type OpenedContract } from "@ton/core";
import { type WalletContractV4, type WalletContractV5R1 } from "@ton/ton";
import { getWalletContract } from "src/utils/getWalletContract";

import { useTonClient } from "./useTonClient";

export type TonWallet = OpenedContract<WalletContractV4 | WalletContractV5R1>;

interface Options {
  publicKey: string;
  walletVersion: "V4" | "V5R1";
  network: "testnet" | "mainnet";
}

export const useTonWalletContract = ({ publicKey, walletVersion, network }: Options) => {
  const { data: tonClient } = useTonClient({ network });

  return useQuery({
    queryKey: ["tonWallet", publicKey, walletVersion, network],
    queryFn: async () => {
      if (!tonClient) {
        throw new Error("TonClient is not available");
      }

      const WalletContract = getWalletContract(walletVersion);

      const wallet = WalletContract.create({
        workchain: 0,
        publicKey: Buffer.from(publicKey, "hex"),
      });

      const contract = tonClient.open(wallet);

      return contract;
    },
    enabled: !!tonClient,
    staleTime: Infinity,
  });
};
