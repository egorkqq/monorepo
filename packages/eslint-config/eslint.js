/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  plugins: ["@typescript-eslint", "import", "unicorn"],
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        args: "all",
        argsIgnorePattern: "^_",
        caughtErrors: "all",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
    "@typescript-eslint/no-explicit-any": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "arrow-body-style": ["error", "as-needed"],
    "no-return-await": ["error"],
    "object-shorthand": ["error"],
    "no-unneeded-ternary": ["error"],
    "@typescript-eslint/no-namespace": "off",
    "prefer-template": ["error"],
    "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
    "no-empty": ["error", { allowEmptyCatch: true }],
    "max-len": "off",
  },
  settings: {
    "import/resolver": {
      node: {
        moduleDirectory: ["node_modules", "src/"],
        extensions: [".js", ".ts", ".jsx", ".tsx"],
      },
      typescript: {
        project: ["packages/*/tsconfig.json", "apps/*/tsconfig.json"],
      },
    },

    "import/extensions": [".js", ".ts", ".jsx", ".tsx"],
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
    "dist/",
    "package.json",
    "**/*.config.ts",
  ],

  overrides: [
    {
      files: ["packages/eslint-config/*.js"],
      rules: {
        "@typescript-eslint/no-require-imports": "off",
        "no-undef": "off",
      },
    },
  ],
};
