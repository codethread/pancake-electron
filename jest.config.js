// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const client = './src/**/*.ts?(x)';
const server = './electron/**/*.ts';
const shared = './shared/**/*.ts';
const all = [client, server, shared];
const escapeHatch = ['!**/github.ts'];

module.exports = {
  clearMocks: true,

  collectCoverage: true,
  collectCoverageFrom: all.concat(escapeHatch),
  coverageThreshold: all.reduce(
    (coverage, name) => ({
      ...coverage,
      [name]: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    }),
    {}
  ),

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
