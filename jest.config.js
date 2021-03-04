/* eslint-disable @typescript-eslint/no-unsafe-return */
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

const client = './client/**/*.ts?(x)';
const server = './electron/**/*.ts';
const shared = './shared/**/*.ts';
const all = [client, server, shared];
const escapeHatch = ['!**/github.ts'];
module.exports = {
  preset: 'ts-jest',

  collectCoverage: false,
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

  clearMocks: true,

  setupFilesAfterEnv: ['./tooling/setupTests.ts'],
  modulePathIgnorePatterns: ['e2e'],
};
