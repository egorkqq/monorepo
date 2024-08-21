/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["./eslint", "airbnb", "airbnb/hooks", "plugin:react/recommended", "plugin:jsx-a11y/recommended"],
  plugins: ["@typescript-eslint"],

  globals: {
    React: true,
    JSX: true,
  },

  env: {
    browser: true,
  },

  settings: { react: { version: "18.2.0" } },

  overrides: [
    // Force ESLint to detect .tsx files
    { files: ["*.js?(x)", "*.ts?(x)"] },
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

    "react/react-in-jsx-scope": "off",
    "react/prop-types": "error",
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
