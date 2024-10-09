import { useEffect, useState } from "react";

import { cn } from "@arc/ui/cn";
import { Drawer } from "@arc/ui/drawer";
import { FingerScanIcon } from "@arc/ui/icons/finger-scan";
import { KeyboardDelIcon } from "@arc/ui/icons/keyboard-del";

interface PincodeModalProps {
  isOpen: boolean;
  onSuccess: (pin: string | null) => void;
  onClose: () => void;
}

export const PincodeModal = ({ isOpen, onSuccess, onClose }: PincodeModalProps) => {
  const [pin, setPin] = useState<string>("");
  const [title, setTitle] = useState<string>("Enter PIN code");

  const handleNumberClick = (number: number) => {
    if (pin.length < 4) {
      setPin((prevPin) => prevPin + number);
    }
  };

  const handleDelete = () => {
    setPin((prevPin) => prevPin.slice(0, -1));
  };

  const handleFingerprint = () => {
    // Implement fingerprint logic here
    console.log("Fingerprint scan initiated");
  };

  useEffect(() => {
    if (pin.length === 4) {
      onSuccess(pin);
      setPin("");
    }
  }, [pin, onSuccess]);

  useEffect(() => {
    if (isOpen) {
      setPin("");
      setTitle("Enter PIN code");
    }
  }, [isOpen]);

  return (
    <Drawer isOpen={isOpen} fullHeight onClose={onClose}>
      <div className="bg-background flex h-full flex-col items-center justify-center p-4">
        <h1 className="text-title-1 text-text mb-8 font-medium">{title}</h1>

        <div className="bg-background-secondary mb-8 flex w-48 justify-center rounded-xl px-16 py-3">
          {[0, 1, 2, 3].map((key) => (
            <div className={cn(`p-2`)} key={key}>
              <div className={cn(`bg-separator h-3 w-3 rounded-full`, pin.length > key && "bg-accent")} />
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <button
              type="button"
              key={number}
              onClick={() => handleNumberClick(number)}
              className="text-text border-separator flex h-[72px] w-[72px] items-center justify-center rounded-full border text-2xl text-[36px] font-semibold"
            >
              {number}
            </button>
          ))}
          <button
            type="button"
            onClick={handleFingerprint}
            className="border-separator flex h-[72px] w-[72px] items-center justify-center rounded-full border disabled:opacity-40"
            disabled
          >
            <FingerScanIcon className="stroke-accent h-6 w-6 fill-none" />
          </button>
          <button
            type="button"
            onClick={() => handleNumberClick(0)}
            className="text-text border-separator flex h-[72px] w-[72px] items-center justify-center rounded-full border text-2xl text-[36px] font-semibold"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="border-separator flex h-[72px] w-[72px] items-center justify-center rounded-full border"
          >
            <KeyboardDelIcon className="fill-accent h-7 w-7" />
          </button>
        </div>
      </div>
    </Drawer>
  );
};
