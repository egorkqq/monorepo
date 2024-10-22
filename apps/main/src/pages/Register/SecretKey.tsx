import { useEffect } from "react";

import { mnemonicNew } from "@ton/crypto";
import { atom, useAtom, useSetAtom } from "jotai";

import { useTonWallets } from "@arc/sdk";
import { CopyIcon } from "@arc/ui/icons/copy";

import { mainButtonAtom } from "@/atoms/ui";
import { Loader } from "@/components/Loader";
import { usePincodeModal } from "@/components/Pincode/usePincodeModal";

const mnemonicAtom = atom<string[]>([]);

export const RegisterSecretKey = () => {
  const setMainButton = useSetAtom(mainButtonAtom);
  const [mnemonic, setMnemonic] = useAtom(mnemonicAtom);
  const mnemonicExists = mnemonic.length > 0;

  const { promptPincode, PincodeModalComponent } = usePincodeModal();

  const { addWallet, list } = useTonWallets();

  useEffect(() => {
    if (mnemonicExists) return;

    mnemonicNew(24).then((mn) => {
      setMnemonic(mn);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    try {
      const pin = await promptPincode(list.length > 0 ? "get" : "set");

      if (!pin) {
        throw new Error("User cancelled");
      }

      if (!mnemonicExists) {
        throw new Error("Mnemonic is not set");
      }

      addWallet(mnemonic, pin, "V5R1");

      setMnemonic([]);
    } catch (err) {
      // TODO: Alert
      console.error("Failed to add wallet: ", err);
    }
  };

  useEffect(() => {
    setMainButton({
      title: "Next",
      onClick: handleSubmit,
    });

    return () => {
      setMainButton({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleSubmit]);

  const handleCopy = () => {
    navigator.clipboard.writeText(mnemonic.join(" "));
  };

  return (
    <>
      <h1 className="text-title-1 mb-5 mt-4 font-medium">Your secret key</h1>

      {/* TODO: skeleton */}
      {!mnemonicExists ? (
        <div className="flex h-[408px] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="bg-background-secondary mb-5 flex h-[408px] flex-col flex-wrap gap-2 gap-x-12 rounded-2xl px-8 py-4">
          {mnemonic.map((word, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={`mnemonic-word-${idx}`}>
              <span className="text-text-secondary">{idx + 1}.</span> {word}
            </div>
          ))}
        </div>
      )}

      {mnemonicExists && (
        <button
          type="button"
          onClick={handleCopy}
          className="border-accent text-accent mx-auto flex w-min items-center justify-center gap-2 rounded-2xl border px-6 py-2"
        >
          <CopyIcon className="stroke-accent h-6 w-6 fill-none stroke-1" />
          <span className="whitespace-nowrap">Copy to clipboard</span>
        </button>
      )}

      {PincodeModalComponent}
    </>
  );
};
