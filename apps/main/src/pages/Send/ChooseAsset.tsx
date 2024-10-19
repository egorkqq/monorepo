import { useNavigate } from "react-router-dom";

import { useTonWallet } from "@arc/sdk";
import { List } from "@arc/ui/list";
import { ListItem } from "@arc/ui/list-item";

import { SkeletonListItem } from "@/components/Skeleton/ListItem";
import { useWalletAssets } from "@/hooks/useWalletAssets";

export const ChooseAsset = () => {
  const navigate = useNavigate();
  const activeWallet = useTonWallet();
  const { assets, isLoading } = useWalletAssets(activeWallet?.address);

  return (
    <>
      <h1 className="text-title-1 text-text my-4">Choose asset to send</h1>
      <List className={assets.length <= 1 ? "p-0" : undefined}>
        {isLoading ? (
          <>
            <SkeletonListItem />
            <SkeletonListItem />
            <SkeletonListItem />
          </>
        ) : (
          assets.map((asset) => (
            <ListItem
              key={asset.address}
              leftIcon={<img className="h-11 w-11 rounded-full" src={asset.image} alt={asset.name} />}
              leftTopText={<p className="words-break break-all font-medium">{asset.symbol}</p>}
              leftBottomText={asset.balance}
              onClick={() => {
                navigate(`/send?assetAddress=${asset.address}`);
              }}
              withSeparator
            />
          ))
        )}
      </List>
    </>
  );
};
