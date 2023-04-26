export default {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '^#api/(.*)': '<rootDir>/src/api/$1',
    '^#components/(.*)': '<rootDir>/src/components/$1',
    '^#pages/(.*)': '<rootDir>/src/pages/$1',
    '^#types/(.*)': '<rootDir>/src/types/$1',
    '^#utils/(.*)': '<rootDir>/src/utils/$1',
  },
  testEnvironment: 'jsdom',
  maxWorkers: 2,
  collectCoverage: true,
};
