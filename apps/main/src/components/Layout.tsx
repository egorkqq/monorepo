import { memo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { type Platform } from "@telegram-apps/sdk";
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

import { MainButton } from "./MainButton";

interface LayoutProps {
  platform: Platform;
}

export const Layout: React.FC<LayoutProps> = memo(({ platform }) => {
  const bottomSpacing = platform === "ios" ? "pb-19" : "pb-17";
  const navigate = useNavigate();
  const location = useLocation();
  const showMenu = useAtomValue(showMenuAtom);

  // TODO: Придумать куда это вынести
  const items = [
    {
      label: "Wallet",
      icon: <Wallet2Icon />,
      onClick: () => {
        navigate(AppRoute.home);
      },
      active: !([AppRoute.catalog, AppRoute.market, AppRoute.news, AppRoute.settings] as string[]).includes(
        location.pathname,
      ),
    },
    {
      label: "Apps",
      icon: <BriefcaseIcon />,
      onClick: () => {
        navigate(AppRoute.catalog);
      },
      active: location.pathname.startsWith(AppRoute.catalog),
    },
    {
      label: "Market",
      icon: <Convert3DCubeIcon />,
      onClick: () => {
        navigate(AppRoute.market);
      },
      active: location.pathname.startsWith(AppRoute.market),
    },
    {
      label: "News",
      icon: <BookIcon />,
      onClick: () => {
        navigate(AppRoute.news);
      },
      active: location.pathname.startsWith(AppRoute.news),
    },
    {
      label: "Account",
      icon: <UserIcon />,
      onClick: () => {
        navigate(AppRoute.settings);
      },
      active: location.pathname.startsWith(AppRoute.settings),
    },
  ];

  return (
    <div
      className={cn({
        "bg-background m-auto box-border flex min-h-screen w-full flex-col p-4": true,
        [bottomSpacing]: showMenu,
      })}
    >
      <Outlet />

      {showMenu && <Menu standalone={platform === "ios"} items={items} />}
      <MainButton />
    </div>
  );
});

Layout.displayName = "Layout";
