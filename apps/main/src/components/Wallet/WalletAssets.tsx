import { memo, useMemo } from "react";

import { List } from "@arc/ui/list";
import { ListItem } from "@arc/ui/list-item";

import { useAssetsList } from "@/api/deDust/useAssetsList";
import { useAssetDetails } from "@/api/stonFi/useAssetDetails";
import { formatFromNano } from "@/utils/format";
import { useFormatter } from "@/utils/hooks/useFormatter";

import { SkeletonListItem } from "../Skeleton/ListItem";

const useAssetInfo = ({
  type,
  address,
  nanoBalance,
}: {
  type: "native" | "jetton";
  address: string;
  nanoBalance: string;
}) => {
  const { formatTokenValue, formatCurrency } = useFormatter();
  const { data, isLoading, isError } = useAssetDetails(
    type !== "native" ? address : "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
  );
  const assetName = data?.asset.display_name;
  const priceUsd = data?.asset.third_party_price_usd || data?.asset.dex_usd_price;
  const assetIcon = data?.asset.image_url;

  const balance = useMemo(() => {
    if (!data || isError || isLoading) return undefined;

    const decimals = data.asset.decimals || 9;
    const numBalance = formatFromNano(nanoBalance, decimals);

    return numBalance.toString();
  }, [nanoBalance, data, isError, isLoading]);

  const fullPriceUsd = useMemo(() => {
    if (!balance || !data || isError || isLoading || !priceUsd) return undefined;

    const numPriceUsd = Number(priceUsd);
    const numBalance = Number(balance);

    return Number(numPriceUsd * numBalance);
  }, [priceUsd, balance, data, isError, isLoading]);

  return {
    assetName,
    assetIcon,
    priceUsd: formatCurrency(Number(priceUsd)),
    fullPriceUsd: formatCurrency(fullPriceUsd),
    amount: formatTokenValue(Number(balance)),

    isLoading,
    isError,
  };
};

// ---------------------------------------------------------------------------------------------------------------------

interface AssetItemProps {
  type: "native" | "jetton";
  address: string;
  nanoBalance: string;
}

const AssetItem = memo(({ type, address, nanoBalance }: AssetItemProps) => {
  const { assetName, assetIcon, priceUsd, fullPriceUsd, isLoading, isError, amount } = useAssetInfo({
    type,
    address,
    nanoBalance,
  });

  if (isLoading) return <SkeletonListItem />;

  if (isError) return null;

  return (
    <ListItem
      leftIcon={<img className="h-11 w-11 rounded-full" src={assetIcon} alt={assetName} />}
      leftTopText={<p className="words-break break-all font-medium">{assetName}</p>}
      leftBottomText={`$ ${priceUsd}`}
      rightTopText={<p className="font-medium">{amount}</p>}
      rightBottomText={`$ ${fullPriceUsd}`}
      withSeparator
    />
  );
});

// ---------------------------------------------------------------------------------------------------------------------
interface WalletAssetsProps {
  address?: string;
}

export const WalletAssets = ({ address }: WalletAssetsProps) => {
  const { data: assetsList, isLoading } = useAssetsList(address);

  if (isLoading)
    return (
      <div className="mb-6">
        <h3 className="text-title-1 text-text mb-2 font-medium">Assets</h3>
        <List>
          <SkeletonListItem />
          <SkeletonListItem />
          <SkeletonListItem />
        </List>
      </div>
    );

  if (!address || !assetsList) return null;

  return (
    <div className="mb-6">
      <h3 className="text-title-1 text-text mb-2 font-medium">Assets</h3>

      {assetsList.length === 0 && <div className="text-text-secondary">No assets</div>}

      <List className={assetsList.length <= 1 ? "p-0" : undefined}>
        {assetsList.map((asset) => (
          <AssetItem
            key={asset.address}
            type={asset.asset.type}
            address={asset.asset.address}
            nanoBalance={asset.balance}
          />
        ))}
      </List>
    </div>
  );
};

AssetItem.displayName = "AssetItem";
