/** @type {import('@ianvs/prettier-plugin-sort-imports').PrettierConfig} */
const config = {
  plugins: ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-packagejson", "prettier-plugin-tailwindcss"],

  trailingComma: "all",
  semi: true,
  singleQuote: false,
  printWidth: 120,

  importOrder: [
    "",
    "<TYPES>",
    "<TYPES>^[.]",
    "",
    "^react$",
    "^react(.*)$",
    "",
    "<BUILTIN_MODULES>",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@arc/(.*)$",
    "",
    "^@/(.*)$",
    "",
    "^[./]",
    "",
    "^(?!.*[.]css$)[./].*$",
    ".css$",
  ],
  importOrderTypeScriptVersion: "5.4.5",

  tailwindFunctions: ["cn", "clsx"],
};

export default config;
