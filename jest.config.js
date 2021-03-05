/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

/* eslint-disable @typescript-eslint/no-unsafe-return */

const client = './client/**/*.ts?(x)';
const server = './electron/**/*.ts';
const shared = './shared/**/*.ts';
const all = [server, shared];
const escapeHatch = [
  '!**/index.ts?(x)',
  '!./electron/main.ts',
  '!./electron/preload.ts',
  '!./electron/createWindow.ts',
];
module.exports = {
  preset: 'ts-jest',

  collectCoverage: true,
  collectCoverageFrom: all.concat(escapeHatch),
  coverageThreshold: all.reduce(
    (coverage, name) => ({
      ...coverage,
      [name]: {
        branches: 95,
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
  moduleNameMapper: {
    '^@shared(.*)$': '<rootDir>/shared/$1',
  },
};
