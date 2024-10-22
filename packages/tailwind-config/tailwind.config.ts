import type { Config } from "tailwindcss";

import plugin from "tailwindcss";

const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      boxShadow: {
        none: "0 0 #0000",
        md: "0px 4px 8px -2px #18181B0F",
        elevation3: "var(--shadow-elevation-3)",
      },

      spacing: {
        19: "4.75rem",
        17: "4.25rem",
      },

      colors: {
        text: "var(--text)",
        "text-secondary": "var(--text-secondary)",

        background: "var(--background)",
        "background-secondary": "var(--background-secondary)",

        accent: {
          DEFAULT: "var(--accent)",
          active: "blue",
          focus: "red",
        },

        "accent-2": {
          DEFAULT: "var(--accent-2)",
          focus: "red",
          active: "blue",
        },

        positive: {
          DEFAULT: "var(--text-positive)",
          background: "var(--background-positive)",
        },

        negative: {
          DEFAULT: "var(--text-negative)",
          background: "var(--background-negative)",
        },

        warning: "var(--warning)",
        info: "var(--info)",

        separator: "var(--separator)",

        "icon-fill": "var(--icon-fill)",
      },

      fontSize: {
        base: ["15px", "20px"],

        headline: ["16px", "20px"],
        subhead: ["14px", "18px"],

        "caption-1": ["13px", "16px"],
        "caption-2": ["12px", "14px"],
        "caption-3": ["11px", "14px"],
        "caption-4": ["9px", "12px"],

        "title-1": ["24px", "28px"],
        "title-2": ["20px", "24px"],
      },

      fontFamily: {
        sans: ["Roboto", "'Helvetica Neue'", "Arial", "sans-serif"],
      },

      keyframes: {
        shake: {
          "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
          "20%, 80%": { transform: "translate3d(2px, 0, 0)" },
          "30%, 50%, 70%": { transform: "translate3d(-4px, 0, 0)" },
          "40%, 60%": { transform: "translate3d(4px, 0, 0)" },
        },
      },

      animation: {
        shake: "shake 0.82s cubic-bezier(.36,.07,.19,.97) both",
      },
    },
  },

  plugins: [
    // @ts-ignore
    plugin(({ addVariant }) => {
      addVariant("hover-not-disabled", "&:hover:not(:disabled)");
      addVariant("focus-not-disabled", "&:focus:not(:disabled)");
      addVariant("active-not-disabled", "&:active:not(:disabled)");
    }),
  ],
};
export default config;
