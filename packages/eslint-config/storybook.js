/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "airbnb",
    "airbnb/hooks",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:storybook/recommended",
    "plugin:storybook/csf",
    "plugin:storybook/csf-strict",
    "prettier",
  ],
  plugins: ["@typescript-eslint", "import", "unicorn"],

  globals: {
    React: true,
    JSX: true,
  },

  env: {
    browser: true,
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
    react: { version: "18.3.0" },
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
    // Force ESLint to detect .tsx files
    { files: ["*.js?(x)", "*.ts?(x)", "*.stories.@(ts|tsx|js|jsx|mjs|cjs)"] },
  ],

  rules: {
    "import/prefer-default-export": "off",
    "import/no-relative-packages": "error",
    "import/no-extraneous-dependencies": ["error", { devDependencies: ["**/*.test.ts", "**/*.test.ts", "**/cn.ts"] }],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        mjs: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],

    "new-cap": "off",
    "prefer-template": "off",
    quotes: "off",
    "no-plusplus": "off",
    "no-underscore-dangle": "off",
    "no-else-return": "off",
    "no-shadow": "warn",
    "no-console": [
      "warn",
      {
        allow: ["info", "warn", "error", "debug"],
      },
    ],
    "prefer-destructuring": [
      "warn",
      {
        object: true,
        array: false,
      },
    ],

    "jsx-a11y/anchor-is-valid": "off",

    "react/require-default-props": "off",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/jsx-filename-extension": [
      "error",
      {
        extensions: [".tsx"],
      },
    ],
    "react/button-has-type": "warn",
    "react/jsx-props-no-spreading": [
      "error",
      {
        html: "ignore",
      },
    ],
    "react/function-component-definition": [
      "error",
      {
        namedComponents: "arrow-function",
        unnamedComponents: "function-expression",
      },
    ],

    "react-hooks/exhaustive-deps": "warn",
  },
};
