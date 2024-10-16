import { useQueries, useQuery } from "@tanstack/react-query";

import stonFiAxiosInstance from "@/api/stonFi";

export const AssetKinds = {
  Ton: "ton",
  Wton: "wton",
  Jetton: "jetton",
} as const;

export type AssetKind = keyof typeof AssetKinds;

export interface StonFiAsset {
  balance: string;
  blacklisted: boolean;
  community: boolean;
  contract_address: string;
  decimals: number;
  default_symbol: boolean;
  deprecated: boolean;
  dex_price_usd: string;
  dex_usd_price: string;
  display_name: string;
  image_url: string;
  kind: AssetKind;
  priority: number;
  symbol: string;
  tags: string[];
  taxable: boolean;
  third_party_price_usd: string;
  third_party_usd_price: string;
  wallet_address: string;
}

export interface GetStonFiAssetResponse {
  asset: StonFiAsset;
}

const fetchAssetDetails = async (assetAddress: string) => {
  const response = await stonFiAxiosInstance.get<GetStonFiAssetResponse>(`/assets/${assetAddress}`);
  return response.data;
};

export const useAssetDetails = (assetAddress: string) =>
  useQuery({
    queryKey: ["assetDetails", assetAddress],
    queryFn: async () => fetchAssetDetails(assetAddress),
    enabled: !!assetAddress,
    staleTime: 120000,
    gcTime: 300000,
    retry: 3,
  });

// try error, try suspensequeries
export const useMultiAssetDetails = (assetsAddresses: string[]) =>
  useQueries({
    queries: assetsAddresses.map((address) => ({
      queryKey: ["assetDetails", address],
      queryFn: async () => fetchAssetDetails(address),
      staleTime: Infinity,
    })),
  });
