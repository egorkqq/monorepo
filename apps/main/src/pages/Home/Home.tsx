import type { FC } from "react";

import { useTonWallet } from "@arc/sdk";

import { WalletActions } from "@/components/Wallet/WalletActions";
import { WalletAssets } from "@/components/Wallet/WalletAssets";
import { WalletControls } from "@/components/Wallet/WalletControls";
import { WalletHistory } from "@/components/Wallet/WalletHistory";

export const Home: FC = () => {
  const activeWallet = useTonWallet();

  return (
    <div className="bg-background pb-4">
      <WalletControls walletAddress={activeWallet?.address} walletName={activeWallet?.walletName} />
      <WalletActions />
      <WalletAssets address={activeWallet?.address} />
      <WalletHistory />
    </div>
  );
};
