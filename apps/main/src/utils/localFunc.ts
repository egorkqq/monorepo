import type { ClassValue } from "clsx";

import { clsx } from "clsx";

export function localFunc(...inputs: ClassValue[]) {
  return clsx(inputs);
}
