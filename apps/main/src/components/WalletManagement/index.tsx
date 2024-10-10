import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { trimAddress, useTonWallet } from "@arc/sdk";
import { cn } from "@arc/ui/cn";
import { AddIcon } from "@arc/ui/icons/add";
import { ArrowCircleDownIcon } from "@arc/ui/icons/arrow-circle-down";
import { ArrowSwapHorizontalIcon } from "@arc/ui/icons/arrow-swap-horizontal";
import { ArrowUpIcon } from "@arc/ui/icons/arrow-up";
import { BankIcon } from "@arc/ui/icons/bank";
import { CopyIcon } from "@arc/ui/icons/copy";
import { ScannerIcon } from "@arc/ui/icons/scanner";
import { Setting2Icon } from "@arc/ui/icons/setting-2";

import { AppRoute } from "@/routes";

import { WalletsList } from "./WalletsList";

const Card = "div";
const assetsMock = [
  {
    name: "Toncoin",
    icon: "▼",
    amount: "31.04",
    value: "$ 161,41",
    change: "-7.64%",
    changeColor: "text-red-500",
  },
  { name: "USDT", icon: "₮", amount: "221,14", value: "$ 221,14", change: "", changeColor: "" },
  { name: "BNK", icon: "🏛", amount: "100 000", value: "$ 150 000", change: "", changeColor: "" },
  {
    name: "ARH",
    icon: "◈",
    amount: "10 000",
    value: "$ 2 000",
    change: "+67.64%",
    changeColor: "text-positive",
  },
];

const historyMock = [
  {
    type: "Transaction is proceed",
    amount: "+2 000 TON",
    date: "Yesterday, 14:02",
    icon: (
      <div className="bg-accent flex h-8 w-8 items-center justify-center rounded-full fill-none stroke-white">O</div>
    ),
  },
  {
    type: "Recieved",
    amount: "+2 000 TON",
    date: "Yesterday, 14:02",
    icon: <ArrowSwapHorizontalIcon className="bg-accent h-8 w-8 rounded-full fill-none stroke-white p-1.5" />,
  },
  {
    type: "Sent",
    amount: "-2 000 TON",
    date: "2 June, 14:02",
    icon: <ArrowUpIcon className="bg-accent h-8 w-8 rounded-full fill-none stroke-white p-1.5" />,
  },
  {
    type: "Swap",
    amount: "+2 000 BNK",
    date: "2 June, 14:02",
    icon: <ArrowUpIcon className="bg-accent h-8 w-8 rounded-full fill-none stroke-white p-1.5" />,
  },
  {
    type: "Sent",
    amount: "-2 000 TON",
    date: "1 June, 14:02",
    icon: <ArrowUpIcon className="bg-accent h-8 w-8 rounded-full fill-none stroke-white p-1.5" />,
  },
];

export const WalletManagement = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const activeWallet = useTonWallet();

  return (
    <div className="bg-background overflow-hidden rounded-lg">
      <div className="bg-background-secondary mb-4 rounded-2xl bg-[url('/images/balance-bg.svg')] p-5">
        <div className="mb-4 flex items-center justify-between">
          <button type="button" className="flex items-center" onClick={() => setIsOpen(true)}>
            <span className="text-text text-headline font-medium">{activeWallet?.walletName || "N/A"}</span>
            <ArrowCircleDownIcon
              className={cn("stroke-text fill-none transition-transform duration-300", isOpen ? "rotate-180" : "")}
            />
          </button>
          <div className="flex items-center space-x-2">
            <ScannerIcon className="stroke-text h-6 w-6 fill-none" />
            <Setting2Icon className="stroke-text h-6 w-6 fill-none" />
          </div>
        </div>
        <div className="mb-7">
          <h2 className="text-3xl font-bold">$52 814,17</h2>
          <div className="text-positive flex items-center text-sm">
            <ArrowUpIcon className="stroke-positive inline h-4 w-4 fill-none" />
            <span>6,18% • $10,34</span>
          </div>
        </div>
        <div
          className="flex items-center"
          onClick={() => {
            if (activeWallet?.address) {
              navigator.clipboard.writeText(activeWallet.address);
            }
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (activeWallet?.address) {
                navigator.clipboard.writeText(activeWallet.address);
              }
            }
          }}
        >
          <span className="text-text-secondary text-headline font-medium">{trimAddress(activeWallet?.address)}</span>
          <CopyIcon className="stroke-text-secondary ml-1 h-4 w-4 fill-none" />
        </div>
      </div>

      <div className="bg-background-secondary mb-4 flex justify-center rounded-2xl">
        <ActionButton icon={AddIcon} label="Add Crypto " onClick={() => navigate(AppRoute.deposit)} />
        <ActionButton icon={ArrowUpIcon} label="Send" onClick={() => navigate(AppRoute.send)} />
        <ActionButton icon={ArrowSwapHorizontalIcon} label="Swap" onClick={() => navigate(AppRoute.swap)} />
        <ActionButton icon={BankIcon} label="Bank" onClick={() => navigate(AppRoute.bank)} />
      </div>
      <h3 className="mb-2 font-semibold">Assets</h3>
      <Card className="mb-4">
        <AssetsList assets={assetsMock} />
      </Card>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">History</h3>
        <button type="button" className="text-accent">
          See all
        </button>
      </div>
      <Card>
        <TransactionHistory transactions={historyMock} />
      </Card>

      <WalletsList
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </div>
  );
};

interface ActionButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}

const ActionButton = ({ icon: Icon, label, onClick }: ActionButtonProps) => (
  <button
    type="button"
    className="flex flex-1 flex-col items-center justify-center gap-1 px-1 pb-2 pt-3"
    onClick={onClick}
  >
    <div className="bg-accent flex w-min items-center justify-center rounded-full p-3">
      <Icon className="h-6 w-6 fill-none stroke-white" />
    </div>
    <div className="text-accent text-caption-2 whitespace-nowrap font-medium">{label}</div>
  </button>
);

interface Asset {
  name: string;
  icon: string;
  amount: string;
  value: string;
  change: string;
  changeColor: string;
}

interface AssetsListProps {
  assets: Asset[];
}

export const AssetsList: React.FC<AssetsListProps> = ({ assets }) => (
  <div className="divide-y">
    {assets.map((asset, index) => (
      <div key={index} className="flex items-center justify-between py-2">
        <div className="flex items-center">
          <span className="mr-2 flex h-6 w-6 items-center justify-center text-2xl">{asset.icon}</span>
          <div>
            <p className="font-medium">{asset.name}</p>
            <p className="text-sm text-gray-500">
              $ {asset.amount} <span className={asset.changeColor}>{asset.change}</span>
            </p>
          </div>
        </div>
        <p className="font-medium">{asset.value}</p>
      </div>
    ))}
  </div>
);

interface Transaction {
  type: string;
  amount: string;
  date: string;
  icon: React.ReactNode;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => (
  <div className="divide-y">
    {transactions.map((transaction, index) => (
      <div key={index} className="flex items-center justify-between py-2">
        <div className="flex items-center">
          {transaction.icon}
          <div className="ml-3">
            <p className="font-medium">{transaction.type}</p>
            <p className="text-sm text-gray-500">UQCX...XKdd</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-medium">{transaction.amount}</p>
          <p className="text-sm text-gray-500">{transaction.date}</p>
        </div>
      </div>
    ))}
  </div>
);
