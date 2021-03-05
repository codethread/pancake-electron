import type { Nodenv } from './asserts';
import { assertValidNodenv } from './asserts';

interface URLS {
  readonly main: string;
}

const nodenv = sanitiseNodenv(process.env.NODE_ENV ?? 'production');

/**
 * Development mode
 * Set for local development, with certain features enabled such as browser devtools
 */
const isDev = nodenv === 'development';
/**
 * Production mode
 * Set for how clients will interact with application.
 */
const isProd = nodenv === 'production';
/**
 * Test mode
 * Set for Unit tests via Jest
 * Allows for certain backdoors to be exposed such as forcing errors for testing
 */
const isTest = nodenv === 'test';
/**
 * Integration mode
 * Production like in all ways except that certain electron security features
 * are disabled to allow Spectron to interact with the electron process during
 * e2e tests.
 */
const isIntegration = isProd && process.env.E2E_TESTS === 'true';

const urls: URLS = {
  main: 'http://localhost:4000',
};

export { nodenv, isDev, isProd, isTest, isIntegration, urls };

function sanitiseNodenv(env: string): Nodenv {
  const sanitisedNodenv = env.trim().toLocaleLowerCase();
  assertValidNodenv(sanitisedNodenv);
  return sanitisedNodenv;
}
