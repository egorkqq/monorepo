import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Address, toNano } from "@ton/core";
import { useSetAtom } from "jotai";

import { useSendTransaction, useTonWallet } from "@arc/sdk";
import { cn } from "@arc/ui/cn";

import { useCreateSendJettonTransfer } from "@/api/node/useGenerateSend";
import { showMenuAtom } from "@/atoms/ui";
import { usePincodeModal } from "@/components/Pincode/usePincodeModal";
import { useDebounce } from "@/utils/hooks/useDebounce";

import { ChooseAsset } from "./ChooseAsset";
import { Confirm } from "./Confirm";
import { EnterAddress } from "./EnterAddress";
import { EnterAmount } from "./EnterAmount";

export const SendRoutes = () => {
  const showMenu = useSetAtom(showMenuAtom);

  const [searchParams] = useSearchParams();
  const assetAddress = searchParams.get("assetAddress");
  const toAddress = searchParams.get("toAddress");
  const amount = searchParams.get("amount");

  useEffect(() => {
    showMenu(false);

    return () => {
      showMenu(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!assetAddress) {
    return <ChooseAsset />;
  }

  if (!toAddress) {
    return <EnterAddress assetAddress={assetAddress} />;
  }

  if (!amount) {
    return <EnterAmount assetAddress={assetAddress} toAddress={toAddress} />;
  }

  return <Confirm assetAddress={assetAddress} toAddress={toAddress} amount={amount} />;
};

export const ChooseAssetOld = () => {
  const [selectedAsset, setSelectedAsset] = useState<string | undefined>(undefined);
  const [recipientAddress, setRecipientAddress] = useState("0QC8OkLiHlll4qYDRRwUYU1Vy0gojzIX1MFKjQKFnndzpKq4");
  const [amount, setAmount] = useState("");

  const activeWallet = useTonWallet();

  const debouncedAddress = useDebounce(recipientAddress, 300);
  const debouncedAmount = useDebounce(amount, 300);

  const handleAssetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAsset(event.target.value);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecipientAddress(event.target.value);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const isValidAddress = useCallback(() => {
    try {
      Address.parse(debouncedAddress);
      return true;
    } catch {
      return false;
    }
  }, [debouncedAddress]);

  const { data: transfer, isFetching: isTransferFetching } = useCreateSendJettonTransfer({
    toAddress: debouncedAddress,
    fromAsset: selectedAsset === "TON" ? "" : "kQDJ4yZlYHbwbUtFAtyk7YOMt7cWUY-Hk0TB9-pg2ZOxHMMf",
    amount: debouncedAmount ? toNano(debouncedAmount).toString() : "",
  });

  const send = useSendTransaction();
  const { promptPincode, PincodeModalComponent } = usePincodeModal();

  if (!activeWallet) {
    return <h4>No active wallet</h4>;
  }

  const sendTon = (mnemonics: string[]) =>
    send.mutate(
      {
        publicKey: activeWallet.publicKey,
        mnemonics,
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

  const sendArc = (mnemonics: string[]) => {
    if (!transfer) {
      console.error("Query not ready");
      return;
    }

    send.mutate(
      {
        publicKey: activeWallet.publicKey,
        mnemonics,
        walletVersion: activeWallet.walletVersion,

        value: BigInt(transfer.value),
        to: Address.parse(transfer.to),
        body: transfer.body,
        mode: transfer.mode,
      },
      {
        onError: (error) => {
          console.log({ error });
        },
      },
    );
  };

  const handleSend = async () => {
    if ((isValidAddress() && debouncedAmount) || (selectedAsset === "ARC" && !transfer)) {
      let mnemonics: string[] | null;

      try {
        mnemonics = await promptPincode("decode");

        if (!mnemonics) {
          console.error("No mnemonics provided");
          return;
        }

        if (selectedAsset === "TON") {
          sendTon(mnemonics);
        } else {
          sendArc(mnemonics);
        }
      } catch (error) {
        console.error("Error unhashing or sending:", error);
      }
    }

    // Proceed with your logic using the obtained pin
    // For example, hash the mnemonic with the pin
  };

  return (
    <div className="bg-background-secondary space-y-4 rounded-2xl p-4">
      <div>
        <div className="text-text mb-1 block text-sm font-medium">Asset</div>
        <select
          id="asset"
          value={selectedAsset}
          onChange={handleAssetChange}
          className="bg-background text-text border-separator w-full rounded-md border p-2"
        >
          {/* {assets.map((asset) => (
            <option key={asset.symbol} value={asset.symbol}>
              {asset.name}
            </option> */}
          {/* ))} */}
        </select>
      </div>

      <div>
        <div className="text-text mb-1 block text-sm font-medium">Recipient Address</div>
        <input
          id="recipient"
          type="text"
          value={recipientAddress}
          onChange={handleAddressChange}
          className={cn(
            "bg-background text-text w-full rounded-md border p-2",
            isValidAddress() ? "border-accent" : "border-separator",
          )}
          placeholder="Enter recipient address"
        />
      </div>

      <div>
        <div className="text-text mb-1 block text-sm font-medium">Amount</div>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={handleAmountChange}
          className="bg-background text-text border-separator w-full rounded-md border p-2"
          placeholder="Enter amount"
        />
      </div>

      {/* {assetDetails && (
        <div className="text-text-secondary text-sm">
          Balance: {assetDetails.asset.balance} {assetDetails.asset.symbol}
        </div>
      )} */}

      <button
        type="button"
        className={cn(
          "w-full rounded-md p-2 font-medium text-white",
          isValidAddress() && debouncedAmount ? "bg-accent" : "bg-background-secondary text-text-secondary",
        )}
        disabled={!isValidAddress() || !debouncedAmount || send.isPending || isTransferFetching}
        onClick={handleSend}
      >
        Send
      </button>

      {send.isError && <div className="text-negative">Error: {send.error.message}</div>}
      {send.isSuccess && <div className="text-positive">Success</div>}
      {send.isPending && <div className="text-warning">Loading...</div>}

      {PincodeModalComponent}
    </div>
  );
};
