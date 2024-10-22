import { useEffect } from "react";
import toast from "react-hot-toast";

import { useHapticFeedback } from "@telegram-apps/sdk-react";
import { mnemonicNew } from "@ton/crypto";
import { atom, useAtom, useSetAtom } from "jotai";

import { useTonWallets } from "@arc/sdk";
import { CopyIcon } from "@arc/ui/icons/copy";

import { mainButtonAtom } from "@/atoms/ui";
import { Loader } from "@/components/Loader";
import { usePincodeModal } from "@/components/Pincode/usePincodeModal";

const mnemonicAtom = atom<string[]>([]);

export const RegisterSecretKey = () => {
  const haptic = useHapticFeedback();
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
        throw new Error("Operation cancelled. Please try again when you're ready.");
      }

      if (!mnemonicExists) {
        throw new Error("We encountered an issue generating your secret key. Please restart the app and try again.");
      }

      addWallet(mnemonic, pin, "V5R1");

      setMnemonic([]);
    } catch (err) {
      haptic.notificationOccurred("error");
      toast.error(
        err instanceof Error ? err.message : "We couldn't create your wallet at this time. Please try again later.",
      );
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
    haptic.impactOccurred("light");
    const promise = navigator.clipboard.writeText(mnemonic.join(" "));

    toast.promise(promise, {
      loading: "Copying...",
      success: "Successfully copied!",
      error: "Failed to copy",
    });
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
