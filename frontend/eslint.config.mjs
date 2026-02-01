import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    extends: fixupConfigRules(
      compat.extends(
        'eslint:recommended',
        'plugin:@typescript-eslint/strict',
        'plugin:@typescript-eslint/stylistic',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended',
      ),
    ),

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
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

      'react/no-array-index-key': 'error',
      'react-hooks/exhaustive-deps': 'error',

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
