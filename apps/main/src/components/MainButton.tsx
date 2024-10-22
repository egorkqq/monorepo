import { memo, useEffect } from "react";

import { useMainButton } from "@telegram-apps/sdk-react";
import { useAtomValue } from "jotai";

import { cn } from "@arc/ui/cn";

import { isTmaEnvironmentAtom, mainButtonAtom } from "@/atoms/ui";

import { Loader } from "./Loader";

const MainButtonTMA = memo(
  ({
    title,
    onClick,
    loading,
    disabled,
  }: {
    title: string | undefined;
    onClick: (() => void) | undefined;
    loading: boolean | undefined;
    disabled: boolean | undefined;
  }) => {
    const mb = useMainButton();

    useEffect(() => {
      if (onClick !== undefined) {
        const rmfn = mb.on("click", onClick);

        return () => rmfn();
      }

      return undefined;
    }, [onClick, mb]);

    useEffect(() => {
      if (loading) {
        mb.showLoader();
      } else {
        mb.hideLoader();
      }
    }, [loading, mb]);

    useEffect(() => {
      if (disabled) {
        mb.disable();
      } else {
        mb.enable();
      }
    }, [disabled, mb]);

    useEffect(() => {
      if (title) {
        mb.setText(title);
        mb.show();
      } else {
        mb.setText("");
        mb.hide();
      }
    }, [title, mb]);

    return null;
  },
);

MainButtonTMA.displayName = "MainButtonTMA";

export const MainButton = memo(() => {
  const { onClick, title, loading, disabled } = useAtomValue(mainButtonAtom);

  const isTma = useAtomValue(isTmaEnvironmentAtom);

  if (isTma) return <MainButtonTMA disabled={disabled} title={title} onClick={onClick} loading={loading} />;

  return (
    !!onClick && (
      <>
        <div className="h-20" />

        <div className="border-separator fixed bottom-0 left-0 right-0 border-t-2 p-4">
          <button
            disabled={loading || disabled}
            type="button"
            onClick={onClick}
            className={cn("bg-accent w-full rounded-2xl p-3 text-white", disabled && "opacity-50")}
          >
            {loading ? <Loader /> : title}
          </button>
        </div>
      </>
    )
  );
});

MainButton.displayName = "MainButton";
