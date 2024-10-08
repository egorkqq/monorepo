import { memo } from "react";

import clsx from "clsx";

import { cn } from "@/utils/cn";

export interface MenuItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  active: boolean;
}

interface MenuProps {
  standalone: boolean;
  items: MenuItem[];
}

const MenuButton: React.FC<MenuItem> = memo(({ label, icon, onClick, active }) => (
  <button type="button" onClick={onClick} className="flex flex-1 flex-col items-center justify-center gap-1 p-3">
    <div className={cn({ "stroke-text-secondary flex fill-none": true, "stroke-accent fill-icon-fill": active })}>
      {icon}
    </div>
    <div
      className={clsx({
        "text-caption-2 font-medium": true,
        "text-text-secondary": !active,
        "text-accent": active,
      })}
    >
      {label}
    </div>
  </button>
));

MenuButton.displayName = "MenuButton";

export const Menu: React.FC<MenuProps> = ({ standalone, items }) => (
  <nav
    className={cn({
      "bg-background border-separator fixed bottom-0 left-0 right-0 z-10 w-full border-t": true,
      "pb-2": standalone,
    })}
  >
    <div className="flex w-full justify-between">
      {items.map((item) => (
        <MenuButton key={item.label} label={item.label} icon={item.icon} onClick={item.onClick} active={item.active} />
      ))}
    </div>
  </nav>
);
