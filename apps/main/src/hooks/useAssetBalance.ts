import { useMemo } from "react";

import { useTonWallet } from "@arc/sdk";

import { useAssetsList } from "@/api/deDust/useAssetsList";
import { NATIVE_TON_ADDRESS } from "@/utils/isNativeAddress";

export const useAssetBalance = (assetAddress: string | undefined) => {
  const wallet = useTonWallet();
  const { data: assetsData } = useAssetsList(wallet?.address);

  const assetBalancesMap = useMemo(
    () =>
      assetsData?.reduce(
        (acc, asset) => {
          if (asset.asset.type === "native") {
            acc[NATIVE_TON_ADDRESS] = asset.balance;
            return acc;
          }
          acc[asset.asset.address] = asset.balance;
          return acc;
        },
        {} as Record<string, string>,
      ) || {},
    [assetsData],
  );

  return assetBalancesMap[assetAddress || NATIVE_TON_ADDRESS];
};
