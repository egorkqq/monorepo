import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useTonWallets } from "@arc/sdk";
import { cn } from "@arc/ui/cn";

import { usePincodeModal } from "@/components/Pincode/usePincodeModal";

export const RegisterExisting = () => {
  const { t } = useTranslation();
  const { promptPincode, PincodeModalComponent } = usePincodeModal();
  const [seedPhrase, setSeedPhrase] = useState<string[]>(Array(24).fill(""));
  const [isValid, setIsValid] = useState(false);

  const { addWallet, list } = useTonWallets();

  const handleSubmit = async () => {
    try {
      const pin = await promptPincode(list.length > 0 ? "get" : "set");

      if (!pin) {
        throw new Error("User cancelled");
      }

      addWallet(seedPhrase, pin, "V5R1");
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

    // Добавляем проверку на вставку seed-фразы
    if (value.split(" ").length === 24) {
      handlePaste(value);
    }
  };

  useEffect(() => {
    setIsValid(seedPhrase.every((word) => word.trim().length > 0));
  }, [seedPhrase]);

  return (
    <div>
      Its <b>RegisterRoute.existing</b>
      <h1>{t("REGISTER.EXISTING")}</h1>
      <div>
        {seedPhrase.map((word, index) => (
          <input
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            type="text"
            value={word}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onPaste={(e) => {
              e.preventDefault();
              handlePaste(e.clipboardData.getData("text"));
            }}
            className="w-[50%] rounded-md border-2 border-gray-300 p-2"
          />
        ))}
      </div>
      <button
        type="button"
        className={cn(
          "bg-accent mt-4 flex h-10 w-fit items-center gap-1 rounded-full p-2 pl-3 pr-4 text-white shadow-md",
        )}
        onClick={() => handlePaste()}
      >
        {t("REGISTER.PASTE")}
      </button>
      <button
        type="button"
        className={cn(
          "mt-4 flex h-10 w-fit items-center gap-1 rounded-full p-2 pl-3 pr-4 text-white shadow-md",
          isValid ? "bg-accent" : "bg-gray-400",
        )}
        disabled={!isValid}
        onClick={handleSubmit}
      >
        {t("REGISTER.NEXT")}
      </button>
      {PincodeModalComponent}
    </div>
  );
};
