import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { mnemonicToPrivateKey } from "@ton/crypto";
import { WalletContractV5R1 } from "@ton/ton";
import { useSetAtom } from "jotai";

import { cn } from "@arc/ui/cn";

import { activeUserWalletIdAtom, ConnectionTypes, userWalletsAtom } from "@/state/user";

export const RegisterExisting = () => {
  const { t } = useTranslation();
  const [seedPhrase, setSeedPhrase] = useState(Array(24).fill(""));
  const [isValid, setIsValid] = useState(false);

  const setWallet = useSetAtom(userWalletsAtom);
  const setActiveUserWalletId = useSetAtom(activeUserWalletIdAtom);

  const handleSubmit = async () => {
    const keyPair = await mnemonicToPrivateKey(seedPhrase);

    const workchain = 0; // Usually you need a workchain 0
    const wallet = WalletContractV5R1.create({
      workchain,
      publicKey: keyPair.publicKey,
    });

    const id = crypto.randomUUID();

    setWallet((prev) => [
      ...prev,
      {
        id,
        address: wallet.address.toString({
          urlSafe: true,
          bounceable: true,
        }),
        privateKey: seedPhrase.join(" "),
        publicKey: wallet.publicKey.toString("hex"),
        network: "ton",
        connectionType: ConnectionTypes.SDK,
      },
    ]);

    setActiveUserWalletId(id);
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
