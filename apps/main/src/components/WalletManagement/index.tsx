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
import { List } from "@arc/ui/list";
import { ListItem } from "@arc/ui/list-item";

import { AppRoute } from "@/routes";

import { WalletsList } from "./WalletsList";

const assetsMock = [
  {
    name: "Toncoin",
    icon: <div className="bg-accent flex h-8 w-8 items-center justify-center rounded-full fill-none text-white">▼</div>,
    amount: "31.04",
    price: "5.9",
    value: "$ 161,41",
    change: "-7.64%",
    changeColor: "text-red-500",
  },
  {
    name: "USDT",
    icon: <div className="bg-accent flex h-8 w-8 items-center justify-center rounded-full fill-none text-white">₮</div>,
    amount: "221,14",
    price: "1.01",
    value: "$ 221,14",
    change: "",
    changeColor: "",
  },
  {
    name: "BNK",
    icon: (
      <div className="bg-accent flex h-8 w-8 items-center justify-center rounded-full fill-none text-white">🏛</div>
    ),
    amount: "100 000",
    price: "10",
    value: "$ 150 000",
    change: "",
    changeColor: "",
  },
  {
    name: "ARC",
    icon: <div className="bg-accent flex h-8 w-8 items-center justify-center rounded-full fill-none text-white">◈</div>,
    amount: "10 000",
    price: "0.5",
    value: "$ 2 000",
    change: "+67.64%",
    changeColor: "text-positive",
  },
];

const historyMock = [
  {
    type: "Transaction is proceed",
    amount: "+2 000 TON",
    date: "Today, 14:02",
    icon: <div className="bg-accent flex h-8 w-8 items-center justify-center rounded-full fill-none text-white">O</div>,
  },
  {
    type: "Recieved",
    amount: "+2 000 TON",
    date: "Yesterday, 19:42",
    icon: <ArrowSwapHorizontalIcon className="bg-accent h-8 w-8 rounded-full fill-none stroke-white p-1.5" />,
  },
  {
    type: "Sent",
    amount: "-2 000 TON",
    date: "30 June, 14:02",
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
    <div className="bg-background overflow-hidden rounded-lg pb-4">
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

      <div className="bg-background-secondary mb-[30px] flex justify-center rounded-2xl">
        <ActionButton icon={AddIcon} label="Add Crypto " onClick={() => navigate(AppRoute.deposit)} />
        <ActionButton icon={ArrowUpIcon} label="Send" onClick={() => navigate(AppRoute.send)} />
        <ActionButton icon={ArrowSwapHorizontalIcon} label="Swap" onClick={() => navigate(AppRoute.swap)} disabled />
        <ActionButton icon={BankIcon} label="Bank" onClick={() => navigate(AppRoute.bank)} disabled />
      </div>
      <h3 className="text-title-1 text-text mb-2 font-medium">Assets</h3>

      <AssetsList assets={assetsMock} />

      <h3 className="text-title-1 text-text mb-2 font-medium">History</h3>

      <TransactionHistory transactions={historyMock} />

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
  disabled?: boolean;
  onClick?: () => void;
}

const ActionButton = ({ icon: Icon, label, disabled, onClick }: ActionButtonProps) => (
  <button
    type="button"
    className="flex flex-1 flex-col items-center justify-center gap-1 px-1 pb-2 pt-3 disabled:opacity-50"
    disabled={disabled || !onClick}
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
  price: string;
  value: string;
  change: string;
  changeColor: string;
}

interface AssetsListProps {
  assets: Asset[];
}

export const AssetsList: React.FC<AssetsListProps> = ({ assets }) => (
  <List className="mb-6" onExpand={assets.length > 4 ? () => console.log("expand") : undefined}>
    {assets.map((asset) => (
      <ListItem
        key={asset.name}
        leftIcon={asset.icon}
        leftTopText={<p className="font-medium">{asset.name}</p>}
        leftBottomText={"$ " + asset.price}
        rightTopText={<p className="font-medium">{asset.value}</p>}
        rightBottomText={"$ " + asset.amount}
        withSeparator
      />
    ))}
  </List>
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
  <List onExpand={transactions.length > 4 ? () => console.log("expand") : undefined}>
    {transactions.slice(0, 4).map((tx) => (
      <ListItem
        key={tx.date}
        leftIcon={tx.icon}
        leftTopText={<p className="font-normal">{tx.type}</p>}
        leftBottomText="UQB6Y...31231"
        rightTopText={<p className="font-medium">{tx.amount}</p>}
        rightBottomText={tx.date}
        withSeparator
      />
    ))}
  </List>
);
