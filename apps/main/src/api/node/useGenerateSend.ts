import toast from "react-hot-toast";

import { useQuery } from "@tanstack/react-query";
import { type AxiosResponse } from "axios";

import { useNetwork, useTonWallet } from "@arc/sdk";

import nodeAxiosInstance, { getArcNodeBaseUrl } from "@/api/node";

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
  const { network } = useNetwork();

  return useQuery({
    queryKey: ["sendArc", options],
    queryFn: async () => {
      try {
        if (!activeWallet) {
          throw new Error("No active wallet");
        }

        const response = await nodeAxiosInstance.post<
          SendJettonTransferRequest,
          AxiosResponse<SendJettonTransferResponse>
        >(
          "/builder/jetton/create-transfer",
          {
            user_wallet: activeWallet?.address.toString(),
            destination_user_wallet: options.toAddress,
            from_asset: options.fromAsset,
            amount: options.amount,
            response_destination: options.toAddress,
            forward_ton_amount: options.forwardTonAmount,
          },
          { baseURL: getArcNodeBaseUrl(network) },
        );

        return response.data;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "We couldn't generate the transaction. Please try again.", {
          id: "error-create-transfer",
        });
        return null;
      }
    },
    enabled: !!options.toAddress && !!options.fromAsset && !!options.amount,
  });
};
