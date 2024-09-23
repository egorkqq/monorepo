import { useEffect, useState } from "react";

import { randomUUID } from "crypto";

import { mnemonicNew } from "@ton/crypto";
import { useSetAtom } from "jotai/react";

import { cn } from "@arc/ui/cn";

import { ConnectionTypes, userWalletsAtom } from "@/state/user";
import { getRandomIndexes } from "@/utils/getRandomIndexes";

export const SecretKey = () => {
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [isConfirmationMode, setIsConfirmationMode] = useState(false);
  const [confirmationWords, setConfirmationWords] = useState<{ index: number; word: string }[]>([]);
  const [userInputs, setUserInputs] = useState<string[]>(["", "", ""]);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const setWallet = useSetAtom(userWalletsAtom);

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

    if (newInputs.every((input, i) => input.toLowerCase() === confirmationWords[i]?.word.toLowerCase())) {
      setIsConfirmed(true);
    } else {
      setIsConfirmed(false);
    }
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
          onClick={startConfirmation}
          className={cn(
            "mt-2 flex h-10 w-fit items-center gap-1 rounded-full bg-[#0098EA] p-2 pl-3 pr-4 text-white shadow-md",
          )}
        >
          Next
        </button>
      ) : (
        <div className="mt-4">
          <h3>Подтвердите вашу мнемоническую фразу:</h3>
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
            onClick={() => {
              setWallet((prev) => [
                ...prev,
                {
                  id: randomUUID(),
                  address: "",
                  privateKey: "",
                  publicKey: "",
                  network: "ton",
                  connectionType: ConnectionTypes.SDK,
                },
              ]);
            }}
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
