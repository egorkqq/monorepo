import sharedConfig from "@arc/tailwind-config";
import type { Config } from "tailwindcss";

const config: Pick<Config, "content" | "presets"> = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "../../packages/uikit/**/*.{js,ts,jsx,tsx,mdx}"],
  presets: [sharedConfig],
};

export default config;
