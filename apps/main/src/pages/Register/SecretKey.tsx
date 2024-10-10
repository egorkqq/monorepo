import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { mnemonicNew } from "@ton/crypto";

import { useTonWallets } from "@arc/sdk";
import { cn } from "@arc/ui/cn";

import { usePincodeModal } from "@/components/Pincode/usePincodeModal";

export const RegisterSecretKey = () => {
  const { t } = useTranslation();

  const [mnemonic, setMnemonic] = useState<string[]>([]);

  const { promptPincode, PincodeModalComponent } = usePincodeModal();

  const { addWallet, list } = useTonWallets();

  useEffect(() => {
    mnemonicNew(24).then((mn) => {
      setMnemonic(mn);
    });
  }, []);

  const handleSubmit = async () => {
    try {
      const pin = await promptPincode(list.length > 0 ? "get" : "set");

      if (!pin) {
        throw new Error("User cancelled");
      }
      addWallet(mnemonic, pin, "V5R1");
    } catch (err) {
      // TODO: Alert
      console.error("Failed to add wallet: ", err);
    }
  };

  return (
    <div className="bg-background h-screen w-full">
      <div className="flex flex-wrap gap-2">
        {mnemonic.map((word) => (
          <div key={word}>{word}</div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className={cn(
          "text-text bg-accent mt-2 flex h-10 w-fit items-center gap-1 rounded-full p-2 pl-3 pr-4 shadow-md",
        )}
      >
        Next
      </button>
      {PincodeModalComponent}
    </div>
  );
};
