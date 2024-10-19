import { useEffect } from "react";

import { useTonWallet, useTonWallets } from "@arc/sdk";
import { Drawer } from "@arc/ui/drawer";
import { List } from "@arc/ui/list";

import { WalletItem } from "./WalletItem";

interface WalletsListProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletsListModal = ({ isOpen, onClose }: WalletsListProps) => {
  const { list, selectWallet } = useTonWallets();
  const activeWallet = useTonWallet();

  useEffect(() => {
    if (isOpen) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.length, activeWallet?.id]);

  return (
    <Drawer isOpen={isOpen} title="Wallets" onClose={onClose}>
      <List withGap className="m-4" expandText="Add new" onExpand={() => selectWallet(undefined)}>
        {list.map((wallet) => (
          <WalletItem
            key={wallet.id}
            id={wallet.id}
            address={wallet.address}
            title={wallet.walletName}
            version={wallet.walletVersion}
          />
        ))}

        {/* Add more ListItem components as needed */}
      </List>
    </Drawer>
  );
};
