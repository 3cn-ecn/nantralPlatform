import eslintReact from '@eslint-react/eslint-plugin';
import eslintJs from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    extends: [
      eslintJs.configs.recommended,
      tseslint.configs.strict,
      tseslint.configs.stylistic,
      eslintReact.configs['recommended-typescript'],
      eslintPluginPrettierRecommended,
    ],

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      'linebreak-style': ['error', 'unix'],

      'prettier/prettier': [
        'error',
        {
          usePrettierrc: true,
        },
      ],

      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
        },
      ],

      '@eslint-react/no-array-index-key': 'error',
      '@eslint-react/exhaustive-deps': 'error',

      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@emotion/react',
              importNames: ['useTheme'],
              message: "Use 'useTheme' from '@mui/material' instead.",
            },
            {
              name: '@emotion/styled',
              message: "Use 'styled' from '@mui/material' instead.",
            },
            {
              name: 'react-i18next',
              importNames: ['useTranslation'],
              message:
                "Use 'useTranslation' from '#shared/i18n/useTranslation' instead.",
            },
          ],
          patterns: [
            {
              group: ['**/legacy/*'],
              message:
                'Importing legacy modules into the new codebase is forbidden and can break the frontend.',
            },
          ],
        },
      ],
    },
  },
]);
