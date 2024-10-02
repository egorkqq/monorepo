import { atom } from "jotai/vanilla";

// user: in our backend, has wallets

// wallets of user = [wallet1, wallet2, wallet3]
// wallet: {connectionType, network, address, publickKey, privateKey}

export const authTokenAtom = atom<string | null>(null);
