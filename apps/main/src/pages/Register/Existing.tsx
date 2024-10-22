import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useSetAtom } from "jotai";

import { useTonWallets } from "@arc/sdk";
import { cn } from "@arc/ui/cn";

import { mainButtonAtom } from "@/atoms/ui";
import { usePincodeModal } from "@/components/Pincode/usePincodeModal";

// TODO: move to SDK
const WALLET_VERSIONS = ["V5R1", "V4"] as const;
type WalletVersion = (typeof WALLET_VERSIONS)[number];

export const RegisterExisting = () => {
  const { t } = useTranslation();

  const { promptPincode, PincodeModalComponent } = usePincodeModal();
  const [seedPhrase, setSeedPhrase] = useState<string[]>(Array(24).fill(""));
  const [isValid, setIsValid] = useState(false);
  const [walletVersion, setWalletVersion] = useState<WalletVersion>("V5R1");
  const { addWallet, list } = useTonWallets();

  const handleSubmit = async () => {
    try {
      const pin = await promptPincode(list.length > 0 ? "get" : "set");

      if (!pin) {
        throw new Error("User cancelled");
      }

      const trimmedSeedPhrase = seedPhrase.map((word) => word.trim());

      addWallet(trimmedSeedPhrase, pin, walletVersion);
    } catch (err) {
      // TODO: Alert
      console.error("Failed to add wallet: ", err);
    }
  };

  const handlePaste = async (pastedText?: string) => {
    try {
      const text = pastedText || (await navigator.clipboard.readText());
      const words = text.trim().split(/\s+/);
      if (words.length === 24) {
        setSeedPhrase(words);
      } else {
        // TODO: Alert
        alert(t("REGISTER.INVALID_CLIPBOARD"));
      }
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    const newSeedPhrase = [...seedPhrase];
    newSeedPhrase[index] = value;
    setSeedPhrase(newSeedPhrase);

    if (value.split(" ").length === 24) {
      handlePaste(value);
    }
  };

  useEffect(() => {
    setIsValid(seedPhrase.every((word) => word.trim().length > 0));
  }, [seedPhrase]);

  const setMainButton = useSetAtom(mainButtonAtom);
  useEffect(() => {
    setMainButton({
      title: t("REGISTER.NEXT"),
      onClick: handleSubmit,
      disabled: !isValid,
    });

    return () => {
      setMainButton({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleSubmit, isValid]);

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-title-1 mb-5 mt-4 font-medium">{t("REGISTER.EXISTING")}</h1>
        <div className="bg-background-secondary mb-4 flex gap-2 rounded-xl p-2">
          {WALLET_VERSIONS.map((version) => (
            <button
              type="button"
              key={version}
              className={cn(
                "text-caption-1 rounded-lg px-2 py-1",
                walletVersion === version && "bg-accent text-caption-1",
              )}
              onClick={() => setWalletVersion(version)}
            >
              {version}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-flow-col grid-cols-2 grid-rows-12 gap-2">
        {seedPhrase.map((word, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index} className="bg-background-secondary flex items-center gap-2 rounded-2xl px-5 py-4">
            <div className="text-text-secondary">{index + 1}.</div>
            <input
              type="text"
              value={word}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onPaste={(e) => {
                e.preventDefault();
                handlePaste(e.clipboardData.getData("text"));
              }}
              className="w-full bg-transparent focus:outline-none"
            />
          </div>
        ))}
      </div>

      {PincodeModalComponent}
    </>
  );
};
