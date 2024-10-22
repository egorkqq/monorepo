import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { ArrowRightIcon } from "@arc/ui/icons/arrow-right";
import { CardIcon } from "@arc/ui/icons/card";
import { EmptyWalletAddIcon } from "@arc/ui/icons/empty-wallet-add";
import { ScanBarcodeIcon } from "@arc/ui/icons/scan-barcode";
import { List } from "@arc/ui/list";
import { ListItem } from "@arc/ui/list-item";

import { DepositRoute } from "@/routes";

export const Deposit = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-full">
      <h1 className="text-title-1 my-4 font-medium">How do you want to add crypto?</h1>
      <div className="space-y-3">
        <List withGap>
          <ListItem
            className="px-5 py-4"
            leftIcon={<ScanBarcodeIcon className="stroke-accent fill-none" />}
            leftIconClassName="self-start"
            leftTopText={<div className="mt-0.5 text-base">External Wallet</div>}
            leftBottomText={
              <div className="text-caption-1 text-text-secondary text-left">Receive from another wallet</div>
            }
            rightIcon={<ArrowRightIcon className="stroke-text fill-none opacity-35" />}
            onClick={() => navigate(DepositRoute.external)}
          />
          <ListItem
            className="px-5 py-4 opacity-50"
            leftIcon={<CardIcon className="stroke-accent fill-none" />}
            leftIconClassName="self-start"
            leftTopText={<div className="mt-0.5 text-base">Bank Card</div>}
            leftBottomText={<div className="text-caption-1 text-text-secondary text-left">Buy with your bank card</div>}
            rightIcon={<ArrowRightIcon className="stroke-text fill-none opacity-35" />}
            onClick={() =>
              toast.error(
                "We apologize, but this feature is not available yet. We're working on it and will notify you once it's ready.",
              )
            }
          />
          <ListItem
            className="px-5 py-4 opacity-50"
            leftIcon={<EmptyWalletAddIcon className="stroke-accent fill-none" />}
            leftIconClassName="self-start"
            leftTopText={<div className="mt-0.5 text-base">P2P Market</div>}
            leftBottomText={
              <div className="text-caption-1 text-text-secondary text-left">Buy without intermediaries</div>
            }
            rightIcon={<ArrowRightIcon className="stroke-text fill-none opacity-35" />}
            onClick={() =>
              toast.error(
                "We're sorry, but the P2P Market is still in development. We'll let you know as soon as it becomes available.",
              )
            }
          />
        </List>
      </div>
    </div>
  );
};
