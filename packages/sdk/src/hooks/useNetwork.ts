import { useMemo } from "react";

import { useAtom } from "jotai";

import { networkAtom } from "../state/network";

export const useNetwork = () => {
  const [network, setNetwork] = useAtom(networkAtom);
  const switchNetwork = (network: "testnet" | "mainnet") => {
    setNetwork(network);
  };

  return useMemo(
    () => ({
      network,
      switchNetwork,
    }),
    [network, switchNetwork],
  );
};
