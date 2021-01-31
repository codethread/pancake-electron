import type { Nodenv } from './asserts';
import { assertValidNodenv } from './asserts';

type URLS = {
  readonly main: string;
};

const nodenv = sanitiseNodenv(process.env.NODE_ENV || '');
const isDev = nodenv === 'development';
const isProd = nodenv === 'production';
const isTest = nodenv === 'test';
const urls: URLS = {
  main: 'http://localhost:4000',
};

export { nodenv, isDev, isProd, isTest, urls };

function sanitiseNodenv(env: string): Nodenv {
  const sanitisedNodenv = env.trim().toLocaleLowerCase();
  assertValidNodenv(sanitisedNodenv);
  return sanitisedNodenv;
}
