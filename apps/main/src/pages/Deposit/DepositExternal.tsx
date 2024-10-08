import { useCallback, useEffect, useRef, useState } from "react";

import { useAtomValue, useSetAtom } from "jotai";

import { useTonWallet } from "@arc/sdk";
import { cn } from "@arc/ui/cn";

import { mainButtonAtom, showMenuAtom } from "@/atoms/ui";
import { authTokenAtom } from "@/atoms/user";

interface QRCodeStylingInterface {
  append: (element: HTMLElement) => void;
  update: (options: { data?: string }) => void;
}

export const DepositExternal = () => {
  const wallet = useTonWallet();
  const authToken = useAtomValue(authTokenAtom);
  console.log({ authToken });
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
          image: "/images/arc.png",
          dotsOptions: {
            color: "#232328",
            type: "extra-rounded",
          },
          imageOptions: {
            hideBackgroundDots: true,
            crossOrigin: "anonymous",
            imageSize: 0.5,
            margin: 2,
          },
          backgroundOptions: {
            // TODO: DARK THEME
            color: "#f7f9fb",
            round: 16,
          },
          cornersSquareOptions: {
            type: "extra-rounded",
            color: "#232328",
          },
          cornersDotOptions: {
            color: "#232328",
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
    <div className="mx-auto flex min-h-screen w-min flex-col items-center gap-3">
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
