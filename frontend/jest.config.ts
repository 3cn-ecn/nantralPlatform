import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

export default {
  roots: ['<rootDir>/src'],
  preset: 'ts-jest/presets/js-with-ts',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  setupFiles: ['react-app-polyfill/jsdom'],
  setupFilesAfterEnv: ['<rootDir>/src/shared/testing/setupTests.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(tsx?|jsx?)$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules'],
  modulePaths: [],

  /** the test files to run **/
  testMatch: ['<rootDir>/src/**/*.test.{js,jsx,ts,tsx}'],

  /** the imports to replace in the code **/
  moduleNameMapper: {
    // lodash-es not supported by jest
    '^lodash-es$': 'lodash',
    // mock css imports
    '\\.(css|sass|scss)$':
      '<rootDir>/src/shared/testing/__mocks__/styleMock.ts',
    // path aliases from tsconfig.json (#shared, #modules, etc.)
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: '<rootDir>/src/',
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
};
