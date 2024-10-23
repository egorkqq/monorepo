/* eslint-disable react-hooks/exhaustive-deps */

import { memo, useEffect } from "react";

import { useSetAtom } from "jotai";

import { mainButtonAtom } from "@/atoms/ui";

interface ShowMainButtonProps {
  onClick?: () => void;
  hidden?: boolean;
  loading?: boolean;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
}

export const ShowMainButton: React.FC<ShowMainButtonProps> = memo(
  ({ onClick, loading, disabled, title, hidden, children }) => {
    const setMainButton = useSetAtom(mainButtonAtom);

    useEffect(() => {
      setMainButton({ onClick, loading, disabled, title });

      return () => setMainButton({});
    }, []);

    useEffect(() => {
      setMainButton({ onClick, loading, disabled, title, hidden });
    }, [onClick, loading, disabled, title, hidden]);

    return children;
  },
);

ShowMainButton.displayName = "ShowMainButton";
