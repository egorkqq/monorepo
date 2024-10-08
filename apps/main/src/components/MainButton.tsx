import { memo } from "react";

import { useAtomValue } from "jotai";

import { isTmaEnvironmentAtom, mainButtonAtom } from "@/atoms/ui";

export const MainButton = memo(() => {
  const { onClick, title } = useAtomValue(mainButtonAtom);

  const isTma = useAtomValue(isTmaEnvironmentAtom);

  //   if (isTma) return <MainButtonTMA title={title} onClick={onClick} />;

  return (
    !!onClick && (
      <>
        <div
          style={{
            height: "5rem",
          }}
        />

        <div className="fixed bottom-0 left-0 right-0 p-4">
          <button type="button" onClick={onClick} className="bg-accent w-full rounded-2xl p-3 text-white">
            {title}
          </button>
        </div>
      </>
    )
  );
});

MainButton.displayName = "MainButton";
