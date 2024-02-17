---
sidebar_position: 2
---

# Linter and Formatter

## The Linter

For the linter we use [ESLint](https://eslint.org/), with multiple plugins
for TypeScript, React, and Prettier. Its job is to warn us for potential
errors or bugs, and enforce a consistent code style.

To check all the fontend code (except the legacy), run:

```bash
npm run lint
```

:::tip
The linter is automatically run when you save a file, if you have the
[ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
installed in VSCode.
It will show you the errors and warnings directly in the editor.
:::

If you want to add an exception (for example when the linter raises an error
that is impossible to fix), you can ignore that error by adding a comment:

```ts
// eslint-disable-next-line
const a = 1;
```

All the ESLint rules are defined in the `.eslintrc` file.

## The Formatter

For the formatter we use [Prettier](https://prettier.io/). Its role is to
format the code in a consistent way, so that we don't have to worry about
code styling.

To format all the frontend code (except the legacy), run:

```bash
npm run lint:fix
```

:::tip
The formatter is automatically run when you save a file, if you have the
[Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
installed in VSCode.
:::
