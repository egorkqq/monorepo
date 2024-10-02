import type { Address } from "@ton/core";

import { useMutation } from "@tanstack/react-query";
import { internal, SendMode } from "@ton/core";
import { mnemonicToPrivateKey } from "@ton/crypto";

import { getWalletContract } from "../utils/getWalletContract";
import { useNetwork } from "./useNetwork";
import { useTonClient } from "./useTonClient";

interface MutateOptions {
  // TODO: will be hashed key
  mnemonics: string[];
  publicKey: string;
  walletVersion: "V5R1" | "V4";
  value: bigint;
  to: Address;
  boc?: string;
  lastSeqno?: number;
}

interface Options {
  network?: "testnet" | "mainnet";
}

export const useSendTransaction = ({ network: userNetwork }: Options = {}) => {
  const { network: sdkNetwork } = useNetwork();
  const network = userNetwork || sdkNetwork;

  const { data: tonClient } = useTonClient({ network });

  return useMutation({
    mutationKey: ["sendTransaction", network],
    mutationFn: async (options: MutateOptions) => {
      if (!tonClient) {
        throw new Error("Ton client not found");
      }
      console.log({ network, tonClientN: await tonClient.getBalance(options.to) });

      const keyPair = await mnemonicToPrivateKey(options.mnemonics);

      const WalletContract = getWalletContract(options.walletVersion);
      const wallet = WalletContract.create({
        workchain: 0,
        publicKey: Buffer.from(options.publicKey, "hex"),
      });

      const contract = tonClient.open(wallet);

      // TODO: remove (hack for avoiding node 429 error)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const seqnoCurrent: number = await contract.getSeqno();

      if (options.lastSeqno && seqnoCurrent !== options.lastSeqno) {
        throw new Error("Seqno is not current");
      }

      // setLastSeqno

      // @ts-ignore
      const transfer = await contract.createTransfer({
        seqno: seqnoCurrent,
        secretKey: keyPair.secretKey,
        sendMode: SendMode.PAY_GAS_SEPARATELY,
        messages: [
          internal({
            value: options.value,
            to: options.to,
            body: options.boc,
            // bounce: true,
          }),
        ],
      });

      // TODO: remove (hack for avoiding node 429 error)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const trx = await contract.send(transfer);

      const hash = Buffer.from(`${options.to.toString()}.${seqnoCurrent}`, "utf-8").toString("hex");

      console.log({ hash, trx });
      // dispatch(setExpiration());

      return transfer;
    },
  });
};
