import { type Platform } from "@telegram-apps/sdk-react";

export const getUsePadding = (platform: Platform): boolean => {
  switch (platform) {
    case "ios":
      return true;
    case "android":
    case "android_x":
      return false;
    default:
      return false;
  }
};
