import { atomWithStorage } from "jotai/utils";

export const networkAtom = atomWithStorage<"testnet" | "mainnet">("@arc/sdk/network", "mainnet", undefined, {
  getOnInit: true,
});
