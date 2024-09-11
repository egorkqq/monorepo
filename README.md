# Architecton Monorepo

## Technologies used

- Turborepo
- React Vite
- Tailwind CSS

### Apps and Packages

- `@arc/main`: Architecton main app
- `@arc/eslint-config`: `eslint` configurations
- `@arc/typescript-config`: `tsconfig.json`s used throughout the monorepo
- `@arc/tailwind-config`: shared Tailwind configuration
- `@arc/sdk`: sdk
- `@arc/ui`: uikit

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Setup

To get started, clone the repository and install the dependencies:

```
pnpm install
```

### Build

To build all apps and packages, run the following command:

```
pnpm build
```

### Develop

To run all apps and packages in development mode, run the following command:

```
pnpm dev
```
