import { useAtomValue } from "jotai";

import { useSendTransaction } from "@arc/sdk";

import { activeUserWalletAtom } from "@/atoms/user";

export const Send = () => {
  const send = useSendTransaction("testnet");

  const activeWallet = useAtomValue(activeUserWalletAtom);

  if (!activeWallet) {
    return <h4>No active wallet</h4>;
  }

  if (!activeWallet.publicKey || !activeWallet.privateKey) {
    return <h4>No active wallet keys</h4>;
  }

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          send.mutate({
            publicKey: activeWallet.publicKey,
            privateKey: activeWallet.privateKey,
            walletVersion: "V5R1",
            value: 1,
            boc: "",
            to: "EQCuqXYo2J8SYjSUgnnTdRxR4qRTtfEs7JaC3_U0o5M1keGE",
          })
        }
      >
        Send
      </button>

      {send.isPending && <div>Loading...</div>}
      {send.isError && <div>Error</div>}
      {send.isSuccess && <div>Success</div>}
    </div>
  );
};
