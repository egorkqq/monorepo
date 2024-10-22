import { useCallback, useState } from "react";
import toast from "react-hot-toast";

import { decodePrivateKeyByPin, useTonWallet, useTonWallets } from "@arc/sdk";

import { PincodeModal } from "./PincodeModal";

export type ModalMode = "set" | "get" | "decode";

export const usePincodeModal = (initialMode: ModalMode = "get") => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>(initialMode);
  const [resolvePromise, setResolvePromise] = useState<((value: string | string[] | null) => void) | null>(null);
  const [error, setError] = useState(false);

  const activeWallet = useTonWallet();
  const { list } = useTonWallets();

  const promptPincode = useCallback(<T extends ModalMode>(modeOverride?: T) => {
    if (modeOverride) setMode(modeOverride);
    setIsOpen(true);

    return new Promise<T extends "decode" ? string[] | null : string | null>((resolve) => {
      setResolvePromise(() => resolve);
    });
  }, []);

  const handlePinComplete = useCallback(
    async (pin: string | null) => {
      if (!pin) {
        setIsOpen(false);
        if (resolvePromise) {
          resolvePromise(null);
          setResolvePromise(null);
        }
        return;
      }

      if (mode === "decode") {
        if (!activeWallet) {
          return; // TODO THROW ERROR
        }

        let mnemonic: string[];

        try {
          mnemonic = await decodePrivateKeyByPin(activeWallet.encodedMnemonics, pin);

          if (resolvePromise) {
            resolvePromise(mnemonic);
            setResolvePromise(null);
          }
          setIsOpen(false);
        } catch (err) {
          console.error("Error unhashing or sending:", err);
          setError(true);
        }
      } else if (mode === "get") {
        // NOTE: берем первый, так как по дефолту общий пароль для всех
        // также пока не будет "set" хоть раз (list[0]), "get" не будет работать
        if (!list?.[0]) {
          return;
        }

        let mnemonic: string[];

        try {
          mnemonic = await decodePrivateKeyByPin(list[0].encodedMnemonics, pin);

          if (resolvePromise) {
            resolvePromise(mnemonic);
            setResolvePromise(null);
          }
          setIsOpen(false);
        } catch (err) {
          console.error("Error unhashing or sending:", err);
          setError(true);
        }
      } else {
        if (resolvePromise) {
          resolvePromise(pin);
          setResolvePromise(null);
        }
        setIsOpen(false);
      }
    },
    [mode, resolvePromise, activeWallet, list],
  );

  const handleClose = useCallback(() => {
    if (mode === "set") {
      toast.error("For your security, a PIN is required to continue. Please enter a PIN.", { id: "pincode-required" });
      return;
    }
    handlePinComplete(null);
  }, [handlePinComplete, mode]);

  const PincodeModalComponent = (
    <PincodeModal
      mode={mode}
      topLevelError={error}
      isOpen={isOpen}
      setTopLevelError={setError}
      onPinComplete={handlePinComplete}
      onClose={handleClose}
    />
  );

  return { promptPincode, PincodeModalComponent, setMode };
};
