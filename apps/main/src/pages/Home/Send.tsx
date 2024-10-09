import { Address, toNano } from "@ton/core";

import { useSendTransaction, useTonWallet } from "@arc/sdk";

import { useCreateSendJettonTransfer } from "@/api/node/useGenerateSend";
import { usePincodeModal } from "@/components/Pincode/usePincodeModal";

export const Send = () => {
  const send = useSendTransaction();
  const activeWallet = useTonWallet();
  const { promptPincode } = usePincodeModal();

  const { data: transfer } = useCreateSendJettonTransfer({
    toAddress: "0QC8OkLiHlll4qYDRRwUYU1Vy0gojzIX1MFKjQKFnndzpKq4",
    fromAsset: "kQDJ4yZlYHbwbUtFAtyk7YOMt7cWUY-Hk0TB9-pg2ZOxHMMf",
    amount: toNano("0.1").toString(),
  });

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
        to: Address.parse("0QC8OkLiHlll4qYDRRwUYU1Vy0gojzIX1MFKjQKFnndzpKq4"),
      },
      {
        onError: (error) => {
          console.log({ error });
        },
      },
    );

  const sendArc = () => {
    if (!transfer) {
      console.error("Query not ready");
      return;
    }

    send.mutate({
      publicKey: activeWallet.publicKey,
      mnemonics: activeWallet.mnemonics,
      walletVersion: activeWallet.walletVersion,

      value: BigInt(transfer.value),
      to: Address.parse(transfer.to),
      body: transfer.body,
      mode: transfer.mode,
    });
  };

  const handleSend = async () => {
    console.log("here");
    let pin: string | null = null;
    try {
      pin = await promptPincode();
    } catch (error) {
      console.error("Error unhashing or sending:", error);
    }

    console.log({ pin });

    if (!pin) return;

    // try {
    //   const mnemonic = await unhash(hashedMnemonic, pin);
    //   await sendSignedBoc(boc, mnemonic);
    // } catch (error) {
    //   console.error('Error unhashing or sending:', error);
    //   // Показать сообщение об ошибке пользователю
    // }
  };

  return (
    <>
      <div>Current Wallet: {activeWallet.address}</div>

      <div className="flex gap-4">
        <div>
          <button type="button" onClick={sendTon}>
            Send 0.1 TON
          </button>
        </div>

        <div>
          <button type="button" onClick={sendArc}>
            Send 0.1 ARC
          </button>
        </div>
      </div>

      <div>
        {send.isPending && <div>Loading...</div>}
        {send.isError && <div>Error</div>}
        {send.isSuccess && <div>Success</div>}
      </div>

      <button type="button" onClick={handleSend}>
        Try send )))))))
      </button>
    </>
  );
};
