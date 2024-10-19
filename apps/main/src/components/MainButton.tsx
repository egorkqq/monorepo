import { memo, useEffect } from "react";

import { useMainButton } from "@telegram-apps/sdk-react";
import { useAtomValue } from "jotai";

import { isTmaEnvironmentAtom, mainButtonAtom } from "@/atoms/ui";

import { Loader } from "./Loader";

const MainButtonTMA = memo(
  ({
    title,
    onClick,
    loading,
  }: {
    title: string | undefined;
    onClick: (() => void) | undefined;
    loading: boolean | undefined;
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
      if (title) {
        mb.setText(title);
        mb.enable();
        mb.show();
      } else {
        mb.hide();
      }
    }, [title, mb]);

    return null;
  },
);

MainButtonTMA.displayName = "MainButtonTMA";

export const MainButton = memo(() => {
  const { onClick, title, loading } = useAtomValue(mainButtonAtom);

  const isTma = useAtomValue(isTmaEnvironmentAtom);

  if (isTma && !import.meta.env.DEV) return <MainButtonTMA title={title} onClick={onClick} loading={loading} />;

  return (
    !!onClick && (
      <>
        <div className="h-20" />

        <div className="border-separator fixed bottom-0 left-0 right-0 border-t-2 p-4">
          <button
            disabled={loading}
            type="button"
            onClick={onClick}
            className="bg-accent w-full rounded-2xl p-3 text-white"
          >
            {loading ? <Loader /> : title}
          </button>
        </div>
      </>
    )
  );
});

MainButton.displayName = "MainButton";
