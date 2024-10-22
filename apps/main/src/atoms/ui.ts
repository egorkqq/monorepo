import { retrieveLaunchParams } from "@telegram-apps/sdk";
import { atom } from "jotai";

export const showMenuAtom = atom(false);

export const isTmaEnvironmentAtom = atom(() => {
  try {
    retrieveLaunchParams();
    return true;
  } catch {
    return false;
  }
});

export const mainButtonAtom = atom<{ title?: string; onClick?: () => void; loading?: boolean; disabled?: boolean }>({
  title: undefined,
  onClick: undefined,
  loading: false,
  disabled: false,
});
