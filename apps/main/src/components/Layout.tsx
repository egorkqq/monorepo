import { memo } from "react";
import { Outlet } from "react-router-dom";

import { type Platform } from "@telegram-apps/sdk";

import { cn } from "@arc/ui/cn";

interface LayoutProps {
  platform: Platform;
  showMenu: boolean;
}

export const Layout: React.FC<LayoutProps> = memo(({ platform, showMenu }) => {
  const bottomSpacing = platform === "ios" ? "pb-24" : "pb-20";

  return (
    <div
      className={cn({
        "m-auto box-border flex h-screen w-full flex-col": true,
        [bottomSpacing]: showMenu,
      })}
    >
      <Outlet />
    </div>
  );
});

Layout.displayName = "Layout";
