import type { Config } from "tailwindcss";

import sharedConfig from "@arc/tailwind-config";

const config: Pick<Config, "content" | "presets"> = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  presets: [sharedConfig],
};

export default config;
