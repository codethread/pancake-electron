/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

const client = './client/**/*.ts?(x)';
const server = './electron/**/*.ts';
const shared = './shared/**/*.ts';
const all = [server, shared, client];
const escapeHatch = [
  '!**/index.ts?(x)',
  '!./electron/main.ts', // cba
  '!./client/Main.tsx',
  '!./client/testHelpers/**',
  '!./client/**/*.stories.tsx',
  '!./client/machines/**/*Options.ts', // too annoying to test
  '!./electron/windows/main/createWindow.ts', // TODO
];

module.exports = {
  preset: 'ts-jest',
  collectCoverage: false,
  collectCoverageFrom: all.concat(escapeHatch),
  coverageThreshold: all.reduce(
    (coverage, name) => ({
      ...coverage,
      [name]: {
        branches: 90,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    }),
    {}
  ),
  clearMocks: true,
  setupFilesAfterEnv: ['./tooling/setupTests.ts', './testHelpers/jest.setup.ts'],
  modulePathIgnorePatterns: ['e2e'],
  moduleNameMapper: {
    '^@shared(.*)$': '<rootDir>/shared/$1',
    '^@client(.*)$': '<rootDir>/client/$1',
    '^@electron(.*)$': '<rootDir>/electron/$1',
    '^@test/(.*)$': '<rootDir>/testHelpers/$1',
    'package.json': '<rootDir>/package.json',
  },
};
