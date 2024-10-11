import { useCallback, useEffect, useRef, useState } from "react";

import { useSetAtom } from "jotai";

import { useTonWallet } from "@arc/sdk";
import { cn } from "@arc/ui/cn";

import { mainButtonAtom, showMenuAtom } from "@/atoms/ui";
import { prefersDarkColorScheme } from "@/utils/prefersDarkColorScheme";

const ARC_LOGO =
  "data:image/png;base64,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";

interface QRCodeStylingInterface {
  append: (element: HTMLElement) => void;
  update: (options: { data?: string }) => void;
}

export const DepositExternal = () => {
  const wallet = useTonWallet();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStylingInterface | null>(null);

  const showMenu = useSetAtom(showMenuAtom);
  const setMainButton = useSetAtom(mainButtonAtom);

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
          image: ARC_LOGO,
          dotsOptions: {
            color: prefersDarkColorScheme() ? "#ffffff" : "#232328",
            type: "extra-rounded",
          },
          imageOptions: {
            hideBackgroundDots: true,
            crossOrigin: "anonymous",
            imageSize: 0.5,
            margin: 2,
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
    navigator.clipboard.writeText(wallet?.address || "");
  };

  useEffect(() => {
    showMenu(false);
    setMainButton({
      title: "Copy address",
      onClick: copyAddress,
    });

    // TODO: MainButton controller

    return () => {
      showMenu(true);
      setMainButton({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
  );
};
