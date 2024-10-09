import { memo, useCallback } from "react";

import { atom, useAtom } from "jotai";

import { PincodeModal } from "./PincodeModal";

const isOpenAtom = atom(false);
const pinAtom = atom<string | null>(null);
const resolveAtom = atom<((value: string | null) => void) | null>(null);

export const usePincodeModal = () => {
  const [isOpen, setIsOpen] = useAtom(isOpenAtom);
  const [, setPin] = useAtom(pinAtom);
  const [resolve, setResolve] = useAtom(resolveAtom);

  const promptPincode = useCallback(() => {
    setIsOpen(true);
    setPin(null);

    return new Promise<string | null>((res) => {
      setResolve(() => res);
    });
  }, [setPin, setResolve, setIsOpen]);

  const handleSuccess = useCallback(
    (pin: string | null) => {
      setIsOpen(false);
      setPin(pin);
      if (resolve) {
        resolve(pin);
        setResolve(null);
      }
    },
    [resolve, setPin, setResolve, setIsOpen],
  );

  const handleClose = useCallback(() => {
    handleSuccess(null);
  }, [handleSuccess]);

  return { isOpen, promptPincode, handleSuccess, handleClose };
};

export const PincodeModalContainer = memo(() => {
  const { isOpen, handleSuccess, handleClose } = usePincodeModal();

  return <PincodeModal isOpen={isOpen} onSuccess={handleSuccess} onClose={handleClose} />;
});

PincodeModalContainer.displayName = "PincodeModalContainer";
