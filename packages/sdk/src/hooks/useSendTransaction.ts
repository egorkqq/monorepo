import type { Address } from "@ton/core";

import { useMutation } from "@tanstack/react-query";
import { internal, SendMode } from "@ton/core";
import { mnemonicToPrivateKey } from "@ton/crypto";

import { getWalletContract } from "../utils/getWalletContract";
import { useTonClient } from "./useTonClient";

interface Options {
  network: "testnet" | "mainnet";
  privateKey: string;
  publicKey: string;
  walletVersion: "V5R1" | "V4";
  value: bigint;
  boc: string;
  to: Address;
  lastSeqno?: number;
}

export function hexToBytes(hex: string) {
  return Uint8Array.from(Buffer.from(hex, "hex"));
}

export const useSendTransaction = (network: "testnet" | "mainnet") => {
  const { data: tonClient } = useTonClient({ network });

  return useMutation({
    mutationFn: async (options: Options) => {
      if (!tonClient) {
        throw new Error("Ton client not found");
      }
      const keyPair = await mnemonicToPrivateKey(options.privateKey.split(" "));

      console.log({ 1: Buffer.from(hexToBytes(options.publicKey)) });
      console.log({ 1: Buffer.from(options.publicKey, "hex") });

      const WalletContract = getWalletContract(options.walletVersion);
      const wallet = WalletContract.create({
        workchain: 0,
        publicKey: Buffer.from(options.publicKey, "hex"),
      });

      const contract = tonClient.open(wallet);
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

      try {
        const trx = await contract.send(transfer);

        const hash = Buffer.from(`${options.to.toString()}.${seqnoCurrent}`, "utf-8").toString("hex");

        console.log({ hash, trx });
        // dispatch(setExpiration());
      } catch (e) {
        console.log(e);
        throw e;
      }

      return transfer;
    },
  });
};

export const createTransfer = async () => {
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
};
