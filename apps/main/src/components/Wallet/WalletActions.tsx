import { useNavigate } from "react-router-dom";

import { IconButton } from "@arc/ui/icon-button";
import { AddIcon } from "@arc/ui/icons/add";
import { ArrowSwapHorizontalIcon } from "@arc/ui/icons/arrow-swap-horizontal";
import { ArrowUpIcon } from "@arc/ui/icons/arrow-up";
import { BankIcon } from "@arc/ui/icons/bank";

import { AppRoute } from "@/routes";

export const WalletActions = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-secondary mb-[30px] flex justify-center rounded-2xl">
      <IconButton icon={AddIcon} label="Add Crypto " onClick={() => navigate(AppRoute.deposit)} />
      <IconButton icon={ArrowUpIcon} label="Send" onClick={() => navigate(AppRoute.send)} />
      <IconButton icon={ArrowSwapHorizontalIcon} label="Swap" onClick={() => navigate(AppRoute.swap)} disabled />
      <IconButton icon={BankIcon} label="Bank" onClick={() => navigate(AppRoute.bank)} disabled />
    </div>
  );
};
