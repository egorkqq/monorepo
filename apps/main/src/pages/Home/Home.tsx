import type { FC } from "react";

import { WalletManagement } from "@/components/WalletManagement";

export const Home: FC = () => (
  <ul className="flex flex-col gap-2">
    <WalletManagement />
  </ul>
);
