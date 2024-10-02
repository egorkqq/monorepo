import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { TonConnectButton, useTonAddress, useTonConnectModal } from "@tonconnect/ui-react";
import { useSetAtom } from "jotai";

import { activeUserWalletIdAtom, ConnectionTypes, userWalletsAtom } from "@/atoms/user";
import { RegisterRoute } from "@/routes";

export const RegisterAddWallet = () => {
  const location = useLocation();

  const { state } = useTonConnectModal();
  const address = useTonAddress();

  const setWallet = useSetAtom(userWalletsAtom);
  const setActiveUserWalletId = useSetAtom(activeUserWalletIdAtom);

  useEffect(() => {
    if (state.status === "closed" && state.closeReason === "wallet-selected" && address) {
      const id = crypto.randomUUID();

      setWallet((prev) => [
        ...prev,
        {
          id,
          address,
          connectionType: ConnectionTypes.TonConnect,
          network: "ton",
        },
      ]);

      setActiveUserWalletId(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <>
      Its <b>RegisterRoute.add-wallet --- {location.pathname}</b>
      <Link
        className="flex h-10 w-fit items-center gap-1 rounded-full bg-[#0098EA] p-2 pl-3 pr-4 text-white shadow-md"
        to={RegisterRoute["secret-key"]}
      >
        Create wallet
      </Link>
      <Link
        className="flex h-10 w-fit items-center gap-1 rounded-full bg-[#0098EA] p-2 pl-3 pr-4 text-white shadow-md"
        to={RegisterRoute.existing}
      >
        Add existing
      </Link>
      <TonConnectButton />
    </>
  );
};
