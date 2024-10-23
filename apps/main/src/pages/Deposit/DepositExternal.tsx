import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { useHapticFeedback } from "@telegram-apps/sdk-react";
import { useSetAtom } from "jotai";

import { useTonWallet } from "@arc/sdk";
import { cn } from "@arc/ui/cn";

import { showMenuAtom } from "@/atoms/ui";
import { ShowMainButton } from "@/components/MainButton";
import { prefersDarkColorScheme } from "@/utils/prefersDarkColorScheme";

interface QRCodeStylingInterface {
  append: (element: HTMLElement) => void;
  update: (options: { data?: string }) => void;
}

export const DepositExternal = () => {
  const wallet = useTonWallet();
  const haptic = useHapticFeedback();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStylingInterface | null>(null);

  const showMenu = useSetAtom(showMenuAtom);

  const createQRCode = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const QRCodeStyling = (await import("qr-code-styling")).default;

      if (!qrCodeRef.current) {
        // Add this check
        qrCodeRef.current = new QRCodeStyling({
          data: wallet?.address,
          width: 220,
          height: 220,
          dotsOptions: {
            color: prefersDarkColorScheme() ? "#ffffff" : "#232328",
            type: "extra-rounded",
          },
          backgroundOptions: {
            color: prefersDarkColorScheme() ? "#232324" : "#f7f9fb",
          },
          cornersSquareOptions: {
            type: "extra-rounded",
            color: prefersDarkColorScheme() ? "#ffffff" : "#232328",
          },
          cornersDotOptions: {
            color: prefersDarkColorScheme() ? "#ffffff" : "#232328",
          },
          qrOptions: {
            errorCorrectionLevel: "Q",
          },
        });
      } else {
        qrCodeRef.current.update({ data: wallet?.address });
      }

      if (qrRef.current && !qrRef.current.hasChildNodes()) {
        // Add this check
        qrCodeRef.current.append(qrRef.current);
      }
    } catch (e: unknown) {
      console.error(e);
      setError("QR code generation failed");
    } finally {
      setLoading(false);
    }
  }, [wallet?.address]);

  useEffect(() => {
    createQRCode();
  }, [createQRCode]);

  const copyAddress = () => {
    if (wallet?.address) {
      haptic.impactOccurred("light");
      const promise = navigator.clipboard.writeText(wallet.address);
      toast.promise(promise, {
        loading: "Copying...",
        success: "Successfully copied!",
        error: "Failed to copy",
      });
    }
  };

  useEffect(() => {
    showMenu(false);

    return () => {
      showMenu(true);
    };
  }, [showMenu]);

  return (
    <ShowMainButton onClick={copyAddress} title="Copy address">
      <div className="mx-auto flex w-min flex-col items-center gap-3">
        <h1 className="text-title-1 mb-3 mt-4 font-medium">Your Address</h1>
        <div className="text-text text-center text-base">
          Deposits should be made exclusively through the <span className="text-accent font-medium">TON</span> network
        </div>
        <div
          className="bg-background-secondary flex w-min flex-col gap-4 rounded-2xl p-4"
          onClick={copyAddress}
          onKeyDown={(e) => e.key === "Enter" && copyAddress()}
          tabIndex={0}
          role="button"
          aria-label="Copy address"
        >
          <div className={cn("h-56 w-56", loading ? "bg-text-secondary animate-pulse rounded-2xl" : "")} ref={qrRef}>
            {error && (
              <div className="flex flex-col items-center">
                <div className="text-negative my-auto text-center text-base">{error}</div>
                <button type="button" onClick={createQRCode}>
                  Retry
                </button>
              </div>
            )}
          </div>
          <div className="text-text break-all font-mono text-base">{wallet?.address}</div>
        </div>
      </div>
    </ShowMainButton>
  );
};
