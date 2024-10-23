import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { useTonWallets } from "@arc/sdk";
import { TabGroup } from "@arc/ui/tab-group";

import { ShowMainButton } from "@/components/MainButton";
import { usePincodeModal } from "@/components/Pincode/usePincodeModal";

// TODO: move to SDK
const WALLET_VERSIONS = ["V5R1", "V4"] as const;
const WALLET_VERSIONS_MAP = {
  V5R1: "V5",
  V4: "V4",
} as const;

type WalletVersion = (typeof WALLET_VERSIONS)[number];

export const RegisterExisting = () => {
  const { t } = useTranslation();

  const { promptPincode, PincodeModalComponent } = usePincodeModal();
  const [seedPhrase, setSeedPhrase] = useState<string[]>(Array(24).fill(""));
  const [hideButton, setHideButton] = useState(false);
  const [walletVersion, setWalletVersion] = useState<WalletVersion>("V5R1");
  const { addWallet, list } = useTonWallets();

  const handleSubmit = async () => {
    setHideButton(true);
    try {
      const pin = await promptPincode(list.length > 0 ? "get" : "set");

      if (!pin) {
        throw new Error("Operation cancelled. Please try again when you're ready.");
      }

      const trimmedSeedPhrase = seedPhrase.map((word) => word.trim());

      addWallet(trimmedSeedPhrase, pin, walletVersion);
    } catch (err) {
      setHideButton(false);
      toast.error(
        err instanceof Error ? err.message : "We couldn't create your wallet at this time. Please try again later.",
      );
    }
  };

  const handlePaste = async (pastedText?: string) => {
    try {
      const text = pastedText || (await navigator.clipboard.readText());
      const words = text.trim().split(/\s+/);
      if (words.length === 24) {
        setSeedPhrase(words);
      } else {
        throw new Error("It seems the pasted text doesn't contain 24 words. Please check and try again.");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "We couldn't access the clipboard. Please try pasting manually.",
      );
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

  return (
    <ShowMainButton
      onClick={handleSubmit}
      title={t("REGISTER.NEXT")}
      disabled={seedPhrase.some((word) => word.trim().length === 0)}
      hidden={hideButton}
    >
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-title-1 mb-5 mt-4 font-medium">{t("REGISTER.EXISTING")}</h1>

        <TabGroup<WalletVersion>
          items={WALLET_VERSIONS.map((version) => ({ label: WALLET_VERSIONS_MAP[version], value: version }))}
          value={walletVersion}
          onSelect={setWalletVersion}
        />
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
    </ShowMainButton>
  );
};
