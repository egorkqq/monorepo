import { memo } from "react";

import { cn } from "@/utils/cn";

interface ButtonProps {
  icon: React.ElementType;
  label?: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Button = memo(({ icon: Icon, label, disabled, onClick, className }: ButtonProps) => (
  <button
    type="button"
    className={cn(
      "flex flex-1 flex-col items-center justify-center gap-1 px-1 pb-2 pt-3 disabled:opacity-50",
      className,
    )}
    disabled={disabled || !onClick}
    onClick={onClick}
  >
    <div className="bg-accent flex w-min items-center justify-center rounded-full p-3">
      <Icon className="h-6 w-6 fill-none stroke-white" />
    </div>
    {label && <div className="text-accent text-caption-2 whitespace-nowrap font-medium">{label}</div>}
  </button>
));

Button.displayName = "IconButton";
