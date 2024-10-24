import { memo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { type Platform } from "@telegram-apps/sdk";
import { useHapticFeedback } from "@telegram-apps/sdk-react";
import { useAtomValue } from "jotai";

import { cn } from "@arc/ui/cn";
import { BookIcon } from "@arc/ui/icons/book";
import { BriefcaseIcon } from "@arc/ui/icons/briefcase";
import { Convert3DCubeIcon } from "@arc/ui/icons/convert-3d-cube";
import { UserIcon } from "@arc/ui/icons/user";
import { Wallet2Icon } from "@arc/ui/icons/wallet-2";
import { Menu } from "@arc/ui/menu";

import { showMenuAtom } from "@/atoms/ui";
import { AppRoute } from "@/routes";

import BackButton from "./BackButton";
import { MainButton } from "./MainButton";
import { StyledToaster } from "./Toaster";

interface LayoutProps {
  platform: Platform;
}

export const Layout: React.FC<LayoutProps> = memo(({ platform }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const showMenu = useAtomValue(showMenuAtom);
  const haptic = useHapticFeedback();

  // TODO: Придумать куда это вынести
  const items = [
    {
      label: "Wallet",
      icon: <Wallet2Icon />,
      onClick: () => {
        haptic.impactOccurred("medium");
        navigate(AppRoute.home);
      },
      active: !([AppRoute.catalog, AppRoute.market, AppRoute.news, AppRoute.settings] as string[]).includes(
        location.pathname,
      ),
      disabled: location.pathname === AppRoute.home,
    },
    {
      label: "Apps",
      icon: <BriefcaseIcon />,
      onClick: () => {
        haptic.impactOccurred("medium");
        navigate(AppRoute.catalog);
      },
      active: location.pathname.startsWith(AppRoute.catalog),
      disabled: location.pathname === AppRoute.catalog,
    },
    {
      label: "Market",
      icon: <Convert3DCubeIcon />,
      onClick: () => {
        haptic.impactOccurred("medium");
        navigate(AppRoute.market);
      },
      active: location.pathname.startsWith(AppRoute.market),
      disabled: location.pathname === AppRoute.market,
    },
    {
      label: "News",
      icon: <BookIcon />,
      onClick: () => {
        haptic.impactOccurred("medium");
        navigate(AppRoute.news);
      },
      active: location.pathname.startsWith(AppRoute.news),
      disabled: location.pathname === AppRoute.news,
    },
    {
      label: "Account",
      icon: <UserIcon />,
      onClick: () => {
        haptic.impactOccurred("medium");
        navigate(AppRoute.settings);
      },
      active: location.pathname.startsWith(AppRoute.settings),
      disabled: location.pathname === AppRoute.settings,
    },
  ];

  return (
    <div className="bg-background flex h-screen flex-col overflow-hidden">
      <StyledToaster />
      <div className="flex-grow overflow-y-auto">
        <div
          className={cn({
            "m-auto box-border flex h-full w-full flex-col p-4": true,
          })}
        >
          <Outlet />
        </div>
      </div>

      {showMenu && <Menu standalone={platform === "ios"} items={items} />}

      <MainButton />
      <BackButton />
    </div>
  );
});

Layout.displayName = "Layout";
