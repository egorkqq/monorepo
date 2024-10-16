import type { MouseEventHandler } from "react";

import { memo } from "react";

import { type UUID } from "crypto";

import { useHapticFeedback, usePopup } from "@telegram-apps/sdk-react";
import { Address } from "@ton/core";

import { trimAddress, useNetwork, useTonWallets } from "@arc/sdk";
import { LogoutIcon } from "@arc/ui/icons/logout";
import { ListItem } from "@arc/ui/list-item";

export const WalletItem = memo(
  ({ id, address, title, version }: { id: UUID; address: string; title: string; version: string }) => {
    const { network } = useNetwork();
    const popup = usePopup();
    const haptic = useHapticFeedback();

    const humanizedAddress = Address.parse(address).toString({ testOnly: network === "testnet", bounceable: false });

    const trimmedAddress = trimAddress(humanizedAddress);
    const { disconnectWallet, selectWallet } = useTonWallets();

    // TODO: telegram alert! for confirm
    const handleDisconnectWallet: MouseEventHandler<SVGSVGElement> = (e) => {
      e.stopPropagation();
      popup
        .open({
          title: "Disconnect wallet?",
          message: "Are you sure you want to disconnect this wallet?",
          buttons: [
            { id: "disconnect", type: "destructive", text: "Disconnect" },
            { id: "cancel", type: "default", text: "Cancel" },
          ],
        })
        .then((buttonId) => {
          if (buttonId === "disconnect") {
            disconnectWallet(id);
          }
        });
    };

    const handleSelectWallet = () => {
      haptic.impactOccurred("medium");
      selectWallet(id);
    };

    return (
      <ListItem
        leftTopText={title}
        leftBottomText={trimmedAddress}
        rightTopText="3 TON" // можно баланс выводить
        rightBottomText={version}
        rightIcon={<LogoutIcon onClick={handleDisconnectWallet} className="stroke-negative fill-none" />}
        onClick={handleSelectWallet}
      />
    );
  },
);

WalletItem.displayName = "WalletItem";
