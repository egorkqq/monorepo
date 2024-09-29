import type { FC } from "react";

import { Link } from "react-router-dom";

import { WalletManagement } from "@/components/WalletManagement";
import { AppRoute } from "@/routes";

export const Home: FC = () => (
  <ul className="flex flex-col gap-2">
    <WalletManagement />
    <li className="text-text text-base">
      <Link to={AppRoute.bank}>Bank</Link>
    </li>

    <li className="text-text text-base">
      <Link to={AppRoute.catalog}>Catalog</Link>
    </li>

    <li className="text-text text-base">
      <Link to={AppRoute.deposit}>Deposit</Link>
    </li>

    <li className="text-text text-base">
      <Link to={AppRoute.market}>Market</Link>
    </li>

    <li className="text-text text-base">
      <Link to={AppRoute.news}>News</Link>
    </li>

    <li className="text-text text-base">
      <Link to={AppRoute.settings}>Settings</Link>
    </li>
  </ul>
);
