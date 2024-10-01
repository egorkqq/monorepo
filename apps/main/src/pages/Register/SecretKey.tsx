import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { mnemonicNew, mnemonicToPrivateKey } from "@ton/crypto";
import { WalletContractV5R1 } from "@ton/ton";
import { useSetAtom } from "jotai/react";

import { cn } from "@arc/ui/cn";

import { activeUserWalletIdAtom, ConnectionTypes, userWalletsAtom } from "@/state/user";
import { getRandomIndexes } from "@/utils/getRandomIndexes";

export const RegisterSecretKey = () => {
  const { t } = useTranslation();

  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [isConfirmationMode, setIsConfirmationMode] = useState(false);
  const [confirmationWords, setConfirmationWords] = useState<{ index: number; word: string }[]>([]);
  const [userInputs, setUserInputs] = useState<string[]>(["", "", ""]);

  const setWallet = useSetAtom(userWalletsAtom);
  const setActiveUserWalletId = useSetAtom(activeUserWalletIdAtom);

  useEffect(() => {
    mnemonicNew(24).then((mn) => {
      setMnemonic(mn);
    });
  }, []);

  const startConfirmation = () => {
    const randomIndexes = getRandomIndexes(3, mnemonic.length);

    setConfirmationWords(randomIndexes.map((index) => ({ index, word: mnemonic[index] || "" })));

    setIsConfirmationMode(true);
  };

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...userInputs];
    newInputs[index] = value;
    setUserInputs(newInputs);
  };

  const isConfirmed = useMemo(
    () => userInputs.every((input, i) => input.toLowerCase() === confirmationWords[i]?.word.toLowerCase()),
    [userInputs, confirmationWords],
  );

  const handleSubmit = async () => {
    const keyPair = await mnemonicToPrivateKey(mnemonic);

    const workchain = 0; // Usually you need a workchain 0
    const wallet = WalletContractV5R1.create({
      workchain,
      publicKey: keyPair.publicKey,
    });

    const id = crypto.randomUUID();

    console.log(wallet);

    setWallet((prev) => [
      ...prev,
      {
        id,
        address: wallet.address.toString({
          urlSafe: true,
          bounceable: true,
        }),
        privateKey: mnemonic.join(" "),
        publicKey: wallet.publicKey.toString(),
        network: "ton",
        connectionType: ConnectionTypes.SDK,
      },
    ]);

    setActiveUserWalletId(id);
  };

  return (
    <div className="h-screen w-full bg-gray-300">
      <div className="flex flex-wrap gap-2">
        {mnemonic.map((word) => (
          <div key={word}>{word}</div>
        ))}
      </div>

      {!isConfirmationMode ? (
        <button
          type="button"
          onClick={startConfirmation}
          className={cn(
            "mt-2 flex h-10 w-fit items-center gap-1 rounded-full bg-[#0098EA] p-2 pl-3 pr-4 text-white shadow-md",
          )}
        >
          Next
        </button>
      ) : (
        <div className="mt-4">
          <h3>{t("REGISTER.CONFIRM_SECRET_KEY")}:</h3>
          {confirmationWords.map((item, index) => (
            <div key={item.index} className="mt-2">
              <label htmlFor={`word-${item.index}`}>Слово #{item.index + 1}: </label>
              <input
                id={`word-${item.index}`}
                type="text"
                value={userInputs[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className={cn("rounded border px-2 py-1")}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isConfirmed}
            className={cn(
              "mt-4 flex h-10 w-fit items-center gap-1 rounded-full p-2 pl-3 pr-4 text-white shadow-md",
              isConfirmed ? "bg-[#0098EA]" : "bg-gray-400",
            )}
          >
            Подтвердить
          </button>
        </div>
      )}
    </div>
  );
};
