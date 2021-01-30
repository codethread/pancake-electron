// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,

  // collectCoverage: false,
  // collectCoverageFrom: undefined,
  // coverageDirectory: undefined,
  // coveragePathIgnorePatterns: [
  //   "/node_modules/"
  // ],
  // coverageReporters: [
  //   "json",
  //   "text",
  //   "lcov",
  //   "clover"
  // ],
  // coverageThreshold: undefined,

  errorOnDeprecated: true,

  // A set of global variables that need to be available in all test environments
  // globals: {},

  // An array of regexp pattern strings, matched against all module paths before considered 'visible' to the module loader
  modulePathIgnorePatterns: ['packages', 'dist'],

  preset: 'ts-jest',

  setupFilesAfterEnv: ['./tests/setupTests.ts'],

  // The glob patterns Jest uses to detect test files
  // testMatch: [
  //   "**/__tests__/**/*.[jt]s?(x)",
  //   "**/?(*.)+(spec|test).[tj]s?(x)"
  // ],

  // Whether to use watchman for file crawling
  // watchman: true,
};
