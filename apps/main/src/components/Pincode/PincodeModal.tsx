/* eslint-disable no-lonely-if */

import { memo, useEffect, useState } from "react";

import { useHapticFeedback } from "@telegram-apps/sdk-react";

import { cn } from "@arc/ui/cn";
import { Drawer } from "@arc/ui/drawer";
import { FingerScanIcon } from "@arc/ui/icons/finger-scan";
import { KeyboardDelIcon } from "@arc/ui/icons/keyboard-del";

interface PincodeModalProps {
  mode: "set" | "get" | "decode";
  topLevelError: boolean;
  isOpen: boolean;
  setTopLevelError: (error: boolean) => void;
  onPinComplete: (pin: string | null) => void;
  onClose: () => void;
}

export const PincodeModal = memo(
  ({ mode, topLevelError, isOpen, setTopLevelError, onPinComplete, onClose }: PincodeModalProps) => {
    const [pin, setPin] = useState("");
    const [firstPin, setFirstPin] = useState<string | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState(false);

    const haptic = useHapticFeedback();

    const getTitle = () => {
      if (error || topLevelError) return "Wrong PIN code";
      if (isConfirming) return "Confirm PIN code";

      return "Enter PIN code";
    };

    useEffect(() => {
      if (!error && !topLevelError) return;

      haptic.notificationOccurred("error");

      const timer = setTimeout(() => {
        setError(false);
        setTopLevelError(false);
        setPin("");
      }, 700);

      return () => clearTimeout(timer);
    }, [error, haptic, topLevelError, setTopLevelError]);

    useEffect(() => {
      if (pin.length !== 4) return;

      const resetState = () => {
        setFirstPin(null);
        setIsConfirming(false);
        setPin("");
      };

      const handleSetMode = () => {
        if (!isConfirming) {
          setFirstPin(pin);
          setIsConfirming(true);
          setPin("");
        } else if (pin === firstPin) {
          onPinComplete(pin);
          resetState();
        } else {
          setError(true);
          resetState();
        }
      };

      const handleOtherModes = () => {
        onPinComplete(pin);
        setPin("");
      };

      if (mode === "set") {
        handleSetMode();
      } else {
        handleOtherModes();
      }
    }, [pin, mode, isConfirming, firstPin, onPinComplete]);

    useEffect(() => {
      if (!isOpen) {
        // Reset state when modal is closed
        setPin("");
        setFirstPin(null);
        setIsConfirming(false);
        setError(false);
        setTopLevelError(false);
      }
    }, [isOpen, setTopLevelError]);

    const handleNumberClick = (number: number) => {
      haptic.impactOccurred("medium");
      if (pin.length < 4) {
        setPin((prevPin) => prevPin + number);
      }
    };

    const handleDelete = () => {
      haptic.impactOccurred("medium");
      setPin((prevPin) => prevPin.slice(0, -1));
    };

    const handleFingerprint = () => {
      // Implement fingerprint logic here
      console.log("Fingerprint scan initiated");
    };

    return (
      <Drawer isOpen={isOpen} fullHeight onClose={onClose}>
        <div className="bg-background flex h-full flex-col items-center justify-center p-4">
          <h1 className="text-title-1 text-text mb-8 font-medium">{getTitle()}</h1>

          <div
            className={cn(
              "bg-background-secondary mb-8 flex w-48 justify-center rounded-xl px-16 py-3",
              error && "animate-shake",
              topLevelError && "animate-shake",
            )}
          >
            {[0, 1, 2, 3].map((key) => (
              <div className={cn(`p-2`)} key={key}>
                <div
                  className={cn(
                    `bg-separator h-3 w-3 rounded-full`,
                    pin.length > key && "bg-accent",
                    error && "bg-negative",
                    topLevelError && "bg-negative",
                  )}
                />
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
              className="border-separator flex h-[72px] w-[72px] items-center justify-center rounded-full border disabled:opacity-50"
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
  },
);

PincodeModal.displayName = "PincodeModal";
