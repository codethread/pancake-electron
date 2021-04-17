/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

const client = './client/**/*.ts?(x)';
const server = './electron/**/*.ts';
const shared = './shared/**/*.ts';
const all = [server, shared, client];
const escapeHatch = [
  '!**/index.ts?(x)',
  '!./electron/main.ts',
  '!./electron/preload.ts',
  '!./electron/createWindow.ts',
  '!./client/App.tsx',
  '!./client/components/Button/**',
];

module.exports = {
  preset: 'ts-jest',
  collectCoverage: false,
  collectCoverageFrom: all.concat(escapeHatch),
  coverageThreshold: all.reduce(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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
    '^@client(.*)$': '<rootDir>/client/$1',
    'package.json': '<rootDir>/package.json',
  },
};
