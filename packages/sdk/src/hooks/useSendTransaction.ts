import type { Address } from "@ton/core";

import { useMutation } from "@tanstack/react-query";
import { Cell, internal, SendMode } from "@ton/core";
import { mnemonicToPrivateKey } from "@ton/crypto";

import { getWalletContract } from "../utils/getWalletContract";
import { useTonClient } from "./useTonClient";

interface MutateOptions {
  // TODO: useActiveWallet
  // TODO: will be hashed key
  mnemonics: string[];
  publicKey: string;
  walletVersion: "V5R1" | "V4";
  value: bigint;
  to: Address;
  body?: string;
  lastSeqno?: number;
  mode?: SendMode;
}

interface Options {
  network?: "testnet" | "mainnet";
}

export const useSendTransaction = ({ network }: Options = {}) => {
  const { data: tonClient } = useTonClient({ network });

  return useMutation({
    mutationKey: ["sendTransaction", network],
    mutationFn: async (options: MutateOptions) => {
      if (!tonClient) {
        throw new Error("Ton client not found");
      }

      const keyPair = await mnemonicToPrivateKey(options.mnemonics);

      const WalletContract = getWalletContract(options.walletVersion);
      const wallet = WalletContract.create({
        workchain: 0,
        publicKey: keyPair.publicKey,
      });

      const contract = tonClient.open(wallet);

      // TODO: remove (hack for avoiding node 429 error)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const seqnoCurrent: number = await contract.getSeqno();

      if (options.lastSeqno && seqnoCurrent !== options.lastSeqno) {
        throw new Error("Seqno is not current");
      }

      // TODO: if toAddress is not deployed, add TON?

      // setLastSeqno

      // @ts-ignore
      const transfer = await contract.createTransfer({
        seqno: seqnoCurrent,
        secretKey: keyPair.secretKey,
        sendMode: options.mode === undefined ? SendMode.PAY_GAS_SEPARATELY : options.mode,
        messages: [
          internal({
            value: options.value,
            to: options.to,
            body: options.body ? Cell.fromBase64(options.body) : undefined,
          }),
        ],
      });

      // TODO: remove (hack for avoiding node 429 error)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const trx = await contract.send(transfer);

      // const hash = Buffer.from(`${options.to.toString()}.${seqnoCurrent}`, "utf-8").toString("hex");

      console.log({ trx });
      // dispatch(setExpiration());

      return transfer;
    },
  });
};
