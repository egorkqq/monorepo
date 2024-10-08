import { useQuery } from "@tanstack/react-query";
import { type Address } from "@ton/core";

import { useTonClient } from "./useTonClient";

interface Options {
  address: Address;
  network?: "testnet" | "mainnet";
}

// TODO: delete?
export const useIsContractDeployed = (options: Options) => {
  const { data: tonClient } = useTonClient({ network: options.network });

  return useQuery({
    queryKey: ["isContractDeployed", options.address],
    queryFn: async () => {
      if (!tonClient) {
        throw new Error("Ton client not found");
      }

      const isDeployed = await tonClient.isContractDeployed(options.address);

      return isDeployed;
    },
  });
};
