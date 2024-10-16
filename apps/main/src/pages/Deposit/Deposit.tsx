import React from "react";
import { useNavigate } from "react-router-dom";

import { cn } from "@arc/ui/cn";
import { ArrowRightIcon } from "@arc/ui/icons/arrow-right";
import { CardIcon } from "@arc/ui/icons/card";
import { EmptyWalletAddIcon } from "@arc/ui/icons/empty-wallet-add";
import { ScanBarcodeIcon } from "@arc/ui/icons/scan-barcode";

import { DepositRoute } from "@/routes";

interface OptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: (() => void) | undefined;
}

const Option: React.FC<OptionProps> = ({ icon, title, description, onClick }) => (
  <button
    type="button"
    className={cn(
      "bg-background-secondary active:outline-accent flex w-full items-center justify-between rounded-2xl p-4 shadow-sm disabled:opacity-50",
    )}
    disabled={!onClick}
    onClick={onClick}
  >
    <div className="flex items-start">
      <div className="stroke-accent mr-4 fill-none">{icon}</div>
      <div className="flex flex-col items-start gap-0.5">
        <div className="text-text text-left text-base">{title}</div>
        <div className="text-caption-1 text-text-secondary text-left">{description}</div>
      </div>
    </div>
    <ArrowRightIcon className="stroke-text fill-none opacity-35" />
  </button>
);

const options = [
  {
    icon: <ScanBarcodeIcon />,
    title: "External Wallet",
    description: "Receive from another wallet",
    link: DepositRoute.external,
  },
  {
    icon: <CardIcon />,
    title: "Bank Card",
    description: "Buy with your bank card",
  },
  {
    icon: <EmptyWalletAddIcon />,
    title: "P2P Market",
    description: "Buy without intermediaries",
  },
];

export const Deposit = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-full">
      <h1 className="text-title-1 mb-3 mt-4 font-medium">How do you want to add crypto?</h1>
      <div className="space-y-3">
        {options.map((option) => (
          <Option
            key={option.title}
            icon={option.icon}
            title={option.title}
            description={option.description}
            onClick={option.link ? () => navigate(option.link) : undefined}
          />
        ))}
      </div>
    </div>
  );
};
