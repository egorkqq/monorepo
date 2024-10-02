import { useQuery } from "@tanstack/react-query";
import { TonClient } from "@ton/ton";

const MAINNET_NODE_1 = "https://tonb.architecton.site/jsonRPC/";
const MAINNET_NODE_2 = "https://toncenter.com/api/v2/jsonRPC";

const TESTNET_NODE_2 = "https://dev.architecton.site/api/v2/node/rpc/jsonRPC";
const TESTNET_NODE_1 = "https://testnet.toncenter.com/api/v2/jsonRPC";

interface Options {
  network: "testnet" | "mainnet";
}

export const useTonClient = (options: Options) =>
  useQuery({
    queryKey: ["tonClient", options.network],
    queryFn: async () => {
      const endpoints =
        options.network === "testnet" ? [TESTNET_NODE_1, TESTNET_NODE_2] : [MAINNET_NODE_1, MAINNET_NODE_2];

      for (const endpoint of endpoints) {
        try {
          const client = new TonClient({ endpoint });
          // Проверяем подключение
          const info = await client.getMasterchainInfo();
          console.log({ info });
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
