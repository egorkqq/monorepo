import { useCallback, useState } from "react";

import { decodePrivateKeyByPin, useTonWallet } from "@arc/sdk";

import { PincodeModal } from "./PincodeModal";

export type ModalMode = "set" | "get" | "decode";

export const usePincodeModal = (initialMode: ModalMode = "get") => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>(initialMode);
  const [resolvePromise, setResolvePromise] = useState<((value: string | string[] | null) => void) | null>(null);
  const [error, setError] = useState(false);

  const activeWallet = useTonWallet();

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

        // Implement your unhash logic here
        // For example:
        // const mnemonic = unhashMnemonic(pin);
        // resolvePromise(mnemonic);
        // setIsOpen(false);
      } else {
        // Mode is 'set' or 'get', return the PIN
        if (resolvePromise) {
          resolvePromise(pin);
          setResolvePromise(null);
        }
        setIsOpen(false);
      }
    },
    [mode, resolvePromise, activeWallet],
  );

  const handleClose = useCallback(() => {
    if (mode === "set") {
      // TODO: alert with error, when reg we NEED pin (maybe in future, when wallet will be not main part of app)
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
