import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useTonWallets } from "@arc/sdk";
import { cn } from "@arc/ui/cn";

export const RegisterExisting = () => {
  const { t } = useTranslation();
  const [seedPhrase, setSeedPhrase] = useState<string[]>(Array(24).fill(""));
  const [isValid, setIsValid] = useState(false);

  const { addWallet } = useTonWallets();

  const handleSubmit = () => {
    try {
      addWallet(seedPhrase, "V5R1");
    } catch (err) {
      // TODO: Alert
      console.error("Failed to add wallet: ", err);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    const newSeedPhrase = [...seedPhrase];
    newSeedPhrase[index] = value;
    setSeedPhrase(newSeedPhrase);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const words = text.split(" ");
      if (words.length === 24) {
        setSeedPhrase(words);
      } else {
        alert(t("REGISTER.INVALID_CLIPBOARD"));
      }
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
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
            className="w-[50%] rounded-md border-2 border-gray-300 p-2"
          />
        ))}
      </div>
      <button
        type="button"
        className={cn(
          "mt-4 flex h-10 w-fit items-center gap-1 rounded-full bg-[#0098EA] p-2 pl-3 pr-4 text-white shadow-md",
        )}
        onClick={handlePaste}
      >
        {t("REGISTER.PASTE")}
      </button>
      <button
        type="button"
        className={cn(
          "mt-4 flex h-10 w-fit items-center gap-1 rounded-full p-2 pl-3 pr-4 text-white shadow-md",
          isValid ? "bg-[#0098EA]" : "bg-gray-400",
        )}
        disabled={!isValid}
        onClick={handleSubmit}
      >
        {t("REGISTER.NEXT")}
      </button>
    </div>
  );
};
