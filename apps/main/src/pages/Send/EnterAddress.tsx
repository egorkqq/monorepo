import type { MouseEventHandler } from "react";

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { Address } from "@ton/core";

import { cn } from "@arc/ui/cn";
import { ScannerIcon } from "@arc/ui/icons/scanner";

import { ShowMainButton } from "@/components/MainButton";

export const EnterAddress = ({ assetAddress }: { assetAddress: string }) => {
  const navigate = useNavigate();

  const [address, setAddress] = useState("");

  const isValidAddress = useCallback(() => {
    try {
      Address.parse(address);
      return true;
    } catch {
      return false;
    }
  }, [address]);

  return (
    <ShowMainButton
      onClick={() => navigate(`/send?assetAddress=${assetAddress}&toAddress=${address}`)}
      title="Continue"
      hidden={!isValidAddress()}
    >
      <AddressInput onAddressChange={setAddress} onScan={() => {}} />
      <div className="bg-separator -mx-4 my-4 h-0.5 w-[calc(100%+2rem)]" />
      <h3 className="text-title-2 text-text mb-2 font-medium">Recent</h3>
      <div className="text-text-secondary">
        Your recent wallets will be displayed here. The list is empty for now, but not for long!
      </div>
    </ShowMainButton>
  );
};

interface AddressInputProps {
  onAddressChange: (address: string) => void;
  onScan?: () => void;
}

const AddressInput = ({ onAddressChange, onScan }: AddressInputProps) => {
  const [address, setAddress] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    onAddressChange(e.target.value);
  };

  const handlePaste: MouseEventHandler<HTMLButtonElement> = (e) => {
    try {
      e.stopPropagation();
      navigator.clipboard.readText().then((text) => {
        setAddress(text);
        onAddressChange(text);
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "We couldn't access the clipboard. Please try pasting manually.",
        { id: "paste-error" },
      );
    }
  };

  const handleScan: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    onScan?.();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      role="presentation"
      className={cn(
        "bg-background-secondary flex items-center rounded-2xl border-2 border-transparent px-4 py-2.5 transition-all duration-200 ease-in-out focus:outline-none",
        isFocused && "border-accent",
      )}
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Address"
        value={address}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={handleAddressChange}
        className="text-text placeholder-text-secondary w-full flex-grow bg-transparent text-base outline-none"
      />

      <div className="ml-4 flex flex-shrink-0 items-center space-x-2">
        <button
          type="button"
          onClick={handlePaste}
          className="text-accent rounded px-2 py-1 transition-colors duration-200 ease-in-out"
        >
          Paste
        </button>

        <button
          type="button"
          onClick={handleScan}
          className="rounded p-1 transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-40"
          aria-label="Refresh"
          disabled
        >
          <ScannerIcon className="stroke-accent h-6 w-6 fill-none" />
        </button>
      </div>
    </div>
  );
};
