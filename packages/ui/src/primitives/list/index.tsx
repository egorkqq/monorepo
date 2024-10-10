import React from "react";

import { cn } from "@/utils/cn";

interface ListProps {
  children: React.ReactNode;
  withGap?: boolean;
  onExpand?: () => void;
  expandText?: string;
  className?: string;
}

export const List: React.FC<ListProps> = ({
  children,
  withGap = false,
  onExpand,
  expandText = "See All",
  className,
}) => (
  <div className={cn("flex flex-col", withGap ? "gap-3" : "bg-background-secondary rounded-2xl pt-1", className)}>
    {children}
    {!!onExpand && (
      <button type="button" onClick={onExpand} className="text-accent focus:text-accent-2 w-full self-center p-3">
        {expandText}
      </button>
    )}
  </div>
);
