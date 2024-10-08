import { useQuery } from "@tanstack/react-query";
import { type AxiosResponse } from "axios";

import { useTonWallet } from "@arc/sdk";

import axiosInstance from "@/api/node";

interface Options {
  toAddress: string;
  fromAsset: string; // "kQDJ4yZlYHbwbUtFAtyk7YOMt7cWUY-Hk0TB9-pg2ZOxHMMf" -- ARC Testnet
  amount: string;
  forwardTonAmount?: string;
}

interface SendJettonTransferRequest {
  user_wallet: string;
  from_asset: string;
  query_id: number;
  amount: number;
  destination_user_wallet: string;
  response_destination: string;
  custom_payload: string;
  forward_ton_amount: number;
  forward_payload: string;
}

interface SendJettonTransferResponse {
  to: string;
  body: string;
  value: number;
  mode: number;
  body_hash: string;
}

export const useCreateSendJettonTransfer = (options: Options) => {
  const activeWallet = useTonWallet();

  return useQuery({
    queryKey: ["sendArc", options],
    queryFn: async () => {
      if (!activeWallet) {
        throw new Error("No active wallet");
      }

      const response = await axiosInstance.post<SendJettonTransferRequest, AxiosResponse<SendJettonTransferResponse>>(
        "/builder/jetton/create-transfer",
        {
          user_wallet: activeWallet?.address.toString(),
          destination_user_wallet: options.toAddress,
          from_asset: options.fromAsset,
          amount: options.amount,
          response_destination: options.toAddress,
          forward_ton_amount: options.forwardTonAmount,
        },
      );

      return response.data;
    },
  });
};