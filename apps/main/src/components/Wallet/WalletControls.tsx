import { memo, useMemo, useState } from "react";

import { trimAddress } from "@arc/sdk";
import { cn } from "@arc/ui/cn";
import { ArrowCircleDownIcon } from "@arc/ui/icons/arrow-circle-down";
import { CopyIcon } from "@arc/ui/icons/copy";
import { ScannerIcon } from "@arc/ui/icons/scanner";
import { Setting2Icon } from "@arc/ui/icons/setting-2";

import { useAssetsList } from "@/api/deDust/useAssetsList";
import { useMultiAssetDetails } from "@/api/stonFi/useAssetDetails";
import { formatCurrency, formatFromNano } from "@/utils/format";

import { WalletsListModal } from "./WalletsListModal";

interface WalletControlsProps {
  walletName?: string;
  walletAddress?: string;
}

export const WalletControls: React.FC<WalletControlsProps> = memo(({ walletName, walletAddress }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalBalance, isLoading } = useWalletTotalBalance(walletAddress);

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
    }
    // TODO: set copied = success and update icon, then after 1s set it back to false
    // TODO: add toast
  };

  return (
    <>
      <div className="bg-background-secondary mb-4 rounded-2xl bg-[url('/images/balance-bg.svg')] p-5">
        <div className="mb-4 flex items-center justify-between">
          <button type="button" className="flex items-center" onClick={() => setIsOpen(true)}>
            <span className="text-text text-headline font-medium">{walletName || "N/A"}</span>
            <ArrowCircleDownIcon
              className={cn("stroke-text fill-none transition-transform duration-300", isOpen && "rotate-180")}
            />
          </button>
          <div className="flex items-center gap-2">
            <ScannerIcon className="stroke-text h-6 w-6 fill-none" />
            <Setting2Icon className="stroke-text h-6 w-6 fill-none" />
          </div>
        </div>

        <div className="mb-7">
          {isLoading ? (
            <div className="inline-flex h-9 w-20 animate-pulse rounded-xl bg-black/10 dark:bg-white/10" />
          ) : (
            <h2 className="overflow-hidden text-ellipsis whitespace-nowrap text-3xl font-bold">
              $ {formatCurrency(totalBalance)}
            </h2>
          )}
        </div>

        {walletAddress && (
          <div
            className="flex items-center"
            onClick={handleCopyAddress}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCopyAddress();
              }
            }}
          >
            <span className="text-text-secondary text-headline font-medium">{trimAddress(walletAddress)}</span>
            <CopyIcon className="stroke-text-secondary ml-1 h-4 w-4 fill-none" />
          </div>
        )}
      </div>

      <WalletsListModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </>
  );
});

WalletControls.displayName = "WalletControls";

const useWalletTotalBalance = (walletAddress: string | undefined) => {
  const { data: assetsData } = useAssetsList(walletAddress);
  const assetsAddresses =
    assetsData?.map((asset) =>
      asset.asset.type === "jetton" ? asset.asset.address : "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
    ) || [];
  const queryResults = useMultiAssetDetails(assetsAddresses);

  const assetAmountsInDollars = useMemo(
    () =>
      queryResults.map((assetQuery, index) => {
        if (assetQuery.isSuccess && assetQuery.data) {
          const assetPrice = assetQuery.data.asset.dex_price_usd || assetQuery.data.asset.third_party_price_usd || 0;
          const assetBalanceInNano = assetsData?.[index]?.balance as string;
          const balanceInUnits = formatFromNano(assetBalanceInNano, assetQuery.data.asset.decimals);
          const amountInDollars = Number(balanceInUnits) * Number(assetPrice);
          return amountInDollars;
        }
        return 0;
      }),
    [assetsData, queryResults],
  );

  const totalBalance = assetAmountsInDollars?.reduce((sum, amount) => sum + amount, 0);

  const isLoading = !assetsData;

  return { totalBalance, isLoading };
};