import type { VariantProps } from "class-variance-authority";

import React from "react";

import { cva } from "class-variance-authority";

import { cn } from "@/utils/cn";

const listItemVariants = cva(
  "flex items-center justify-between bg-background-secondary rounded-2xl px-4 py-3 active:outline-accent focus:outline-accent",
  {
    variants: {
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
      gap: {
        true: "gap-4",
        false: "gap-2",
      },
    },
    defaultVariants: {
      fullWidth: true,
      gap: true,
    },
  },
);

interface ListItemProps extends VariantProps<typeof listItemVariants> {
  leftIcon?: React.ReactNode;
  leftTopText?: string | React.ReactNode;
  leftBottomText?: string | React.ReactNode;
  rightIcon?: React.ReactNode;
  rightTopText?: string | React.ReactNode;
  rightBottomText?: string | React.ReactNode;
  withSeparator?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const ListItem: React.FC<ListItemProps> = ({
  leftIcon,
  leftTopText,
  leftBottomText,
  rightIcon,
  rightTopText,
  rightBottomText,
  withSeparator,
  fullWidth,
  gap,
  className,
  onClick,
}) => (
  <div
    className={cn(
      listItemVariants({ fullWidth, gap }),
      withSeparator &&
        "focus:bg-background-secondary/70 not-last:rounded-b-none border-b border-black/5 focus:outline-none dark:border-white/5",
      className,
    )}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        onClick?.();
      }
    }}
    role="button"
    tabIndex={0}
  >
    <div className="flex items-center space-x-3">
      {leftIcon && <div className="flex-shrink-0">{leftIcon}</div>}

      <div className="flex flex-col gap-0.5 text-left">
        {leftTopText && <span className="text-text text-headline">{leftTopText}</span>}

        {leftBottomText && <span className="text-text-secondary text-subhead">{leftBottomText}</span>}
      </div>
    </div>
    <div className="flex items-center space-x-3">
      <div className="flex flex-col gap-0.5 text-right">
        {rightTopText && <span className="text-text text-headline">{rightTopText}</span>}

        {rightBottomText && <span className="text-text-secondary text-subhead">{rightBottomText}</span>}
      </div>

      {rightIcon && <div className="flex-shrink-0">{rightIcon}</div>}
    </div>
  </div>
);
