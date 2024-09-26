import { useCallback, useMemo } from "react";

import { atom, useAtomValue, useSetAtom } from "jotai";

export const showMenuAtom = atom(false);

export const useUIState = () => {
  const showMenu = useAtomValue(showMenuAtom);
  const setShowMenu = useSetAtom(showMenuAtom);

  const toggleMenu = useCallback(() => {
    setShowMenu((prev) => !prev);
  }, [setShowMenu]);

  return useMemo(
    () => ({
      showMenu,
      setShowMenu,
      toggleMenu,
    }),
    [showMenu, setShowMenu, toggleMenu],
  );
};
