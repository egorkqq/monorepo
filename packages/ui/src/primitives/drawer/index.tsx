import React, { useEffect, useRef } from "react";

import { CloseSquareIcon } from "@/assets/icons/close-square";
import { cn } from "@/utils/cn";

interface DrawerProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  fullHeight?: boolean;
}

export const Drawer = ({ children, isOpen, onClose, title, fullHeight = false }: DrawerProps) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    let startY: number;
    let currentY: number;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0]?.clientY ?? 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      currentY = e.touches[0]?.clientY ?? 0;
    };

    const handleTouchEnd = () => {
      if (currentY - startY > 40) {
        onClose();
      }
    };

    const drawerElement = drawerRef.current;
    if (drawerElement) {
      drawerElement.addEventListener("touchstart", handleTouchStart);
      drawerElement.addEventListener("touchmove", handleTouchMove);
      drawerElement.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (drawerElement) {
        drawerElement.removeEventListener("touchstart", handleTouchStart);
        drawerElement.removeEventListener("touchmove", handleTouchMove);
        drawerElement.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <div className="z-40 flex">
      {isOpen && (
        <div className={cn("fixed inset-0 z-10 bg-black/35 dark:bg-white/35")} role="presentation" onClick={onClose} />
      )}

      <div
        ref={drawerRef}
        role="dialog"
        className={cn(
          "bg-background fixed bottom-0 left-0 z-20 flex h-[60%] w-full translate-y-full transform flex-col shadow-lg transition-all duration-500",
          {
            "translate-y-0": isOpen,
            "h-full": fullHeight,
            "h-4/6 rounded-t-2xl": !fullHeight,
          },
        )}
      >
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 p-2">
          <div className="bg-background h-1 w-8 rounded-full" />
        </div>

        <div className="flex flex-grow flex-col overflow-hidden rounded-t-2xl">
          <div
            className={cn("flex items-center justify-between pb-2 pl-4 pr-2 pt-2", {
              "border-b border-black/5 pt-4 dark:border-white/5": !!title,
            })}
          >
            <h2 className="text-text text-title-1 font-normal">{title}</h2>
            <button type="button" onClick={onClose}>
              <CloseSquareIcon className="stroke-text h-10 w-10 fill-none p-2" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto pb-4">{children}</div>
        </div>
      </div>
    </div>
  );
};
