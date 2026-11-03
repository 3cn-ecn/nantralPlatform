/** @jest-config-loader-options {"transpileOnly": true} */
import { Config } from 'jest';
import { createJsWithTsEsmPreset, pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json' with { type: 'json' };

const presetConfig = createJsWithTsEsmPreset();

export default {
  ...presetConfig,

  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/legacy/**/*',
  ],
  setupFiles: ['react-app-polyfill/jsdom'],
  setupFilesAfterEnv: ['<rootDir>/src/shared/testing/setupTests.ts'],
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['/node_modules/(?!nock/)'],
  modulePaths: [],

  /** the test files to run **/
  testMatch: ['<rootDir>/src/**/*.test.{js,jsx,ts,tsx}'],

  /** the imports to replace in the code **/
  moduleNameMapper: {
    // mock css imports
    '\\.(css|sass|scss)$':
      '<rootDir>/src/shared/testing/__mocks__/styleMock.ts',
    // path aliases from tsconfig.json (#shared, #modules, etc.)
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: '<rootDir>/',
    }),
  },

  moduleFileExtensions: [
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'json',
    'web.jsx',
    'jsx',
    'node',
  ],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  resetMocks: true,
} satisfies Config;
