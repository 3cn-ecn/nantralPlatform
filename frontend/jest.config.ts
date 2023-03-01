export default {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  testEnvironment: 'jsdom',
  maxWorkers: 2,
  collectCoverage: true,
  collectCoverageFrom: [
    '**/src/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/legacy/**',
    '!**/translations/**',
    '!**/assets/**',
    '!**/*.test.tsx',
    '!**/*NotificationMenu.tsx',
    '!**/*theme.ts',
    '!**/*darktheme.ts',
  ],
  testResultsProcessor: 'jest-sonar-reporter',
};
