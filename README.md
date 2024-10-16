# Architecton Monorepo

## Технологии

- Turborepo
- React + Vite
- Tailwind CSS
- Storybook

## Структура проекта

- `apps/main`: Основное приложение Architecton
- `packages/ui`: UI Kit (компоненты, иконки)
- `packages/sdk`: SDK для работы с блокчейном
- `packages/eslint-config`: Конфигурация ESLint
- `packages/typescript-config`: Конфигурация TypeScript
- `packages/tailwind-config`: Конфигурация Tailwind CSS

## Установка

```bash
pnpm install
```

## Разработка

Запуск всех приложений в режиме разработки:

```bash
pnpm dev
```

## Сборка

Сборка всех приложений и пакетов:

```bash
pnpm build
```

## Storybook

Запуск Storybook для UI Kit:

```bash
cd packages/ui
pnpm storybook
```

Сборка Storybook:

```bash
cd packages/ui
pnpm build-storybook
```

## Импорт компонентов из UI Kit

Для импорта компонентов из UI Kit в приложение используйте следующий синтаксис:

```typescript
import { Button } from "@arc/ui/button";
import { Input } from "@arc/ui/input";
```

- Компоненты из UI Kit импортируются напрямую из соответствующих папок, например: `import { Button } from "@arc/ui/button";`
- Это позволяет использовать tree-shaking и импортировать только нужные компоненты.

## Работа с иконками

При добавлении новых иконок следуйте этим правилам:

1. Используйте точно такой же нейминг, как в Iconsax (см. Figma или [iconsax-react.pages.dev](https://iconsax-react.pages.dev/))
2. Создавайте иконки по образу и подобию существующих (см. примеры в `packages/ui/src/assets/icons`)
3. Импортируйте иконки в приложении так:

```typescript
import { UserIcon } from "@arc/ui/icons/user";
import { WalletIcon } from "@arc/ui/icons/wallet";
```

## Философия проекта

Этот монорепозиторий организован с использованием современных подходов к разработке:

1. **Модульность**: Разделение на пакеты (`packages`) и приложения (`apps`) позволяет лучше организовать код и переиспользовать общие компоненты.
2. **Единый стиль**: Использование общего UI Kit и конфигураций обеспечивает консистентность внутри всего проекта.
3. **Быстрая разработка**: Turborepo оптимизирует сборку и кэширование, ускоряя процесс разработки.
4. **Документация как код**: Storybook позволяет документировать компоненты вместе с кодом.
5. **Типобезопасность**: TypeScript обеспечивает надежность и улучшает developer experience.

Такой подход позволяет эффективно работать над крупным проектом, сохраняя высокое качество кода и удобство разработки.
работки и хорошую масштабируемость.
