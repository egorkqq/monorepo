import { useMemo } from "react";

import { useAssetsList } from "@/api/deDust/useAssetsList";
import { useMultiAssetDetails } from "@/api/stonFi/useAssetDetails";
import { formatFromNano } from "@/utils/format";
import { NATIVE_TON_ADDRESS } from "@/utils/isNativeAddress";

export const useWalletAssets = (walletAddress: string | undefined) => {
  const { data: assetsData } = useAssetsList(walletAddress);
  const assetsAddresses =
    assetsData?.map((asset) => (asset.asset.type === "jetton" ? asset.asset.address : NATIVE_TON_ADDRESS)) || [];
  const queryResults = useMultiAssetDetails(assetsAddresses);

  const assets = useMemo(
    () =>
      queryResults
        .map((assetQuery, index) => {
          if (assetQuery.isSuccess && assetQuery.data) {
            const assetPrice =
              assetQuery.data.asset.dex_price_usd || assetQuery.data.asset.third_party_price_usd || "0";
            const assetBalanceInNano = assetsData?.[index]?.balance as string;
            const balanceInUnits = formatFromNano(assetBalanceInNano, assetQuery.data.asset.decimals);
            const amountInDollars = Number(balanceInUnits) * Number(assetPrice);

            return {
              address: assetQuery.data.asset.contract_address,
              balance: balanceInUnits,
              decimals: assetQuery.data.asset.decimals,
              name: assetQuery.data.asset.display_name,
              symbol: assetQuery.data.asset.symbol,
              type: assetsData?.[index]?.asset.type,
              image: assetQuery.data.asset.image_url,
              price: assetPrice,
              amountInDollars,
            };
          }

          return null;
        })
        .filter((asset) => asset !== null),
    [assetsData, queryResults],
  );

  return { assets, isLoading: assets.length === 0 };
};
