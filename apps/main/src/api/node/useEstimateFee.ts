import { useQuery } from "@tanstack/react-query";
import { type AxiosResponse } from "axios";

import { useNetwork, useTonWallet } from "@arc/sdk";

import nodeAxiosInstance, { getArcNodeBaseUrl } from "@/api/node";

interface Options {
  address: string;
  body: string;
}

interface SendJettonTransferRequest {
  address: string;
  body: string;
  ignore_chksig: boolean;
  init_code: string;
  init_data: string;
}

interface SendJettonTransferResponse {
  ok: boolean;
  result: string;
  error: string;
  code: number;
}

export const useEstimateFee = (options: Options) => {
  const activeWallet = useTonWallet();
  const { network } = useNetwork();

  return useQuery({
    queryKey: ["estimateFee", options],
    queryFn: async () => {
      if (!activeWallet) {
        throw new Error("No active wallet");
      }

      const response = await nodeAxiosInstance.post<
        SendJettonTransferRequest,
        AxiosResponse<SendJettonTransferResponse>
      >(
        "/estimateFee",
        {
          address: options.address,
          body: options.body,
          ignore_chksig: true,
          init_code: "",
          init_data: "",
        },
        { baseURL: getArcNodeBaseUrl(network) },
      );

      return response.data;
    },
    enabled: !!options.address && !!options.body,
  });
};
