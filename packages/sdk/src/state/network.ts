import { atomWithStorage } from "jotai/utils";

export const networkAtom = atomWithStorage<"testnet" | "mainnet">("@arc/sdk/network", "testnet", undefined, {
  getOnInit: true,
});
