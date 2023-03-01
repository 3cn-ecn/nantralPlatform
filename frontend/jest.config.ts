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

  testResultsProcessor: 'jest-sonar-reporter',
};
