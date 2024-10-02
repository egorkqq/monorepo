import { Address, toNano } from "@ton/core";

import { useSendTransaction, useTonWallet } from "@arc/sdk";

export const Send = () => {
  const send = useSendTransaction();
  const activeWallet = useTonWallet();

  if (!activeWallet) {
    return <h4>No active wallet</h4>;
  }

  const sendTon = () =>
    send.mutate(
      {
        publicKey: activeWallet.publicKey,
        mnemonics: activeWallet.mnemonics,
        walletVersion: activeWallet.walletVersion,
        value: toNano("0.1"),
        to: Address.parse("EQCuqXYo2J8SYjSUgnnTdRxR4qRTtfEs7JaC3_U0o5M1keGE"),
      },
      {
        onError: (error) => {
          console.log({ error });
        },
      },
    );

  return (
    <div>
      <button type="button" onClick={sendTon}>
        Send 0.1 TON
      </button>

      {send.isPending && <div>Loading...</div>}
      {send.isError && <div>Error</div>}
      {send.isSuccess && <div>Success</div>}
    </div>
  );
};
