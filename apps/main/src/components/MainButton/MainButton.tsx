import { memo, useEffect } from "react";

import { useMainButton } from "@telegram-apps/sdk-react";
import { useAtomValue } from "jotai";

import { cn } from "@arc/ui/cn";

import { isTmaEnvironmentAtom, mainButtonAtom } from "@/atoms/ui";

import { Loader } from "../Loader";

const MainButtonTMA = memo(
  ({
    title,
    onClick,
    loading,
    disabled,
    hidden,
  }: {
    title: string | undefined;
    onClick: (() => void) | undefined;
    loading: boolean | undefined;
    disabled: boolean | undefined;
    hidden: boolean | undefined;
  }) => {
    const mb = useMainButton();

    useEffect(() => {
      if (onClick !== undefined) {
        const rmfn = mb.on("click", onClick);

        return () => rmfn();
      }

      mb.hide();
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
      } else {
        mb.setText("");
      }
    }, [title, mb]);

    useEffect(() => {
      const showButton = !!onClick && !!title && !hidden;

      if (showButton) {
        mb.show();
      } else {
        mb.hide();
      }
    }, [hidden, onClick, title, mb]);

    return null;
  },
);

MainButtonTMA.displayName = "MainButtonTMA";

export const MainButton = memo(() => {
  const { onClick, title, loading, disabled, hidden } = useAtomValue(mainButtonAtom);

  const showButton = !!onClick && !!title && !hidden;

  const isTma = useAtomValue(isTmaEnvironmentAtom);

  if (isTma && window.location.hostname !== "localhost")
    return <MainButtonTMA disabled={disabled} title={title} onClick={onClick} loading={loading} hidden={hidden} />;

  return (
    showButton && (
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
