import path from 'path';
import type { Nodenv } from './asserts';
import { assertValidNodenv } from './asserts';
import { UserConfig } from './types/config';
import { or } from './utils';

type URLS = {
	readonly main: string;
};

const nodenv = sanitiseNodenv(process.env.NODE_ENV);

/**
 * Development mode
 * Set for local development, with certain features enabled such as browser devtools
 */
const isDev = nodenv === 'development';
/**
 * Production mode
 * Set for how clients will interact with application.
 */
const isProd = or(nodenv === 'production', nodenv === 'integration');
/**
 * Test mode
 * Set for Unit tests via Jest
 * Allows for certain backdoors to be exposed such as forcing errors for testing
 */
const isTest = nodenv === 'test';
/**
 * Integration mode
 * used for playwrite feature tests
 */
const isIntegration = process.env.INT === 'true';

const urls: URLS = {
	main: 'http://localhost:4000',
};

export { nodenv, isDev, isProd, isTest, isIntegration, urls };

function sanitiseNodenv(env?: string): Nodenv {
	if (!env) throw new Error('NODE_ENV is not defined');
	const sanitisedNodenv = env.trim().toLocaleLowerCase();
	assertValidNodenv(sanitisedNodenv);
	return sanitisedNodenv;
}

export const githubScopes = ['repo', 'read:org'];

export function asset(fileName: string): string {
	return path.join(__dirname, fileName);
}

export const emptyConfig: UserConfig = {
	repos: [],
	refreshRate: 30000,
};
