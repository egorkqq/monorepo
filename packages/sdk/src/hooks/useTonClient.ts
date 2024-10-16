import { getHttpEndpoint } from "@orbs-network/ton-access";
import { useQuery } from "@tanstack/react-query";
import { TonClient } from "@ton/ton";

import { useNetwork } from "./useNetwork";

const MAINNET_NODE_1 = "https://tonb.architecton.site/jsonRPC/";
const MAINNET_NODE_2 = "https://toncenter.com/api/v2/jsonRPC";

const TESTNET_NODE_1 = "https://dev.architecton.site/api/v2/node/rpc/jsonRPC";
const TESTNET_NODE_2 = "https://testnet.toncenter.com/api/v2/jsonRPC";

interface Options {
  network?: "testnet" | "mainnet";
}

export const useTonClient = (options: Options = {}) => {
  const { network: sdkNetwork } = useNetwork();

  return useQuery({
    queryKey: ["tonClient", options.network || sdkNetwork],
    queryFn: async () => {
      const network = options.network || sdkNetwork;
      const endpoint = await getHttpEndpoint({
        network: options.network || sdkNetwork,
      });

      const endpoints =
        network === "testnet" ? [endpoint, TESTNET_NODE_1, TESTNET_NODE_2] : [endpoint, MAINNET_NODE_1, MAINNET_NODE_2];

      for (const endpoint of endpoints) {
        try {
          const client = new TonClient({ endpoint });

          // Проверяем подключение
          await client.getMasterchainInfo();

          return client;
        } catch (error) {
          console.log({ error });
          console.warn(`Failed to connect to ${endpoint}. Trying next endpoint.`);
        }
      }

      throw new Error("Failed to connect to any TON node.");
    },
    retry: false,
    staleTime: Infinity,
  });
};
