import { useQuery } from "@tanstack/react-query";

import stonFiAxios from "@/api/stonFi";

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

export const useAssetDetails = (assetAddress: string) =>
  useQuery<GetStonFiAssetResponse>({
    queryKey: ["assetDetails", assetAddress],
    queryFn: async () => {
      const response = await stonFiAxios.get<GetStonFiAssetResponse>(`/v1/assets/${assetAddress}`);
      return response.data;
    },
    enabled: !!assetAddress,
    staleTime: 120000,
    gcTime: 300000,
  });
