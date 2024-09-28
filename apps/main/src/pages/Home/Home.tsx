import type { FC } from "react";

import { Link } from "react-router-dom";

import { AppRoute } from "@/routes";

export const Home: FC = () => (
  <ul className="flex flex-col gap-2">
    <li className="text-text text-xl">
      <Link to={AppRoute.bank}>Bank</Link>
    </li>

    <li className="text-text text-xl">
      <Link to={AppRoute.catalog}>Catalog</Link>
    </li>

    <li className="text-text text-xl">
      <Link to={AppRoute.deposit}>Deposit</Link>
    </li>

    <li className="text-text text-xl">
      <Link to={AppRoute.market}>Market</Link>
    </li>

    <li className="text-text text-xl">
      <Link to={AppRoute.news}>News</Link>
    </li>

    <li className="text-text text-xl">
      <Link to={AppRoute.settings}>Settings</Link>
    </li>
  </ul>
);
