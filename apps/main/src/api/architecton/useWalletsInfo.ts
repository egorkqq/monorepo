import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";

import axiosInstance from "@/api/architecton";
import { authTokenAtom } from "@/atoms/user";

interface CoinMetaDTO {
  name: string;
  description: string;
  address?: string;
  url?: string;
  image?: string;
  imageData?: string;
  decimals?: number;
  symbol?: string;
}

interface CoinDTO {
  type: string;
  amount: number;
  usdPrice: number;
  changePrice: number;
  meta?: CoinMetaDTO;
}

interface TransactionHistoryDTO {
  type: string;
  utime: number;
  addressFrom: string;
  addressTo: string;
  status: boolean;
  value: number;
  symbol: string;
  comment: string | undefined;
}

interface WalletBalanceDTO {
  address: string;
  usdPrice: number;
  seqno: number | null;
  changePrice: number;
  assets: CoinDTO[];
  history: TransactionHistoryDTO[];
}

interface WalletsInfoResponse {
  currentWallet: number;
  wallets: WalletBalanceDTO[];
  tonUsdPrice?: number;
}

export const useWalletsInfo = () => {
  const authToken = useAtomValue(authTokenAtom);

  return useQuery<WalletsInfoResponse>({
    queryKey: ["info"],
    queryFn: async () => {
      const response = await axiosInstance.get<WalletsInfoResponse>("/info");
      return response.data;
    },
    staleTime: 60000, // Данные считаются свежими в течение 1 минуты
    gcTime: 300000, // Данные хранятся в кэше 5 минут
    enabled: !!authToken,
  });
};
