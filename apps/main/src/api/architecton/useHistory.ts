import toast from "react-hot-toast";

import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";

import { useTonWallet } from "@arc/sdk";

import axiosInstance from "@/api/architecton";
import { authTokenAtom } from "@/atoms/user";

export type HistoryResponse = Array<{
  type: string;
  utime: number;
  addressFrom: string;
  addressTo: string;
  status: boolean;
  value: number;
  symbol: string;
  comment: string;
}>;

export const useHistory = () => {
  const authToken = useAtomValue(authTokenAtom);
  const wallet = useTonWallet();

  if (!wallet) {
    throw new Error("Wallet not connected");
  }

  return useQuery<HistoryResponse>({
    queryKey: ["history", wallet.address],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get<HistoryResponse>("/history");

        return response.data;
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch history");

        return [];
      }
    },
    enabled: !!authToken,

    refetchOnMount: true,
    staleTime: 5000,
    gcTime: 5000,
  });
};
