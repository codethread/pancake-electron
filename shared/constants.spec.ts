import { Nodenv } from './asserts';

const originalNodenv = process.env.NODE_ENV;

describe('constants', () => {
	afterAll(() => {
		process.env.NODE_ENV = originalNodenv;
	});

	describe('nodenv', () => {
		const validNodenvs = [
			'test',
			'production',
			'development',
			' development ',
			'    development    ',
			'    DEVELOPMENT    ',
			'DEVELOPMENT',
			'DevElOPmeNT',
		];
		validNodenvs.forEach((env) => {
			describe(`when valid nodenv of "${env}"`, () => {
				it('sets nodenv', () => {
					jest.resetModules();
					process.env.NODE_ENV = env;
					expect(import('./constants')).resolves.not.toThrowError();
				});
			});
		});

		const invalidNodenvs = ['', undefined, 'dev', 'true', 'false', ' '];

		invalidNodenvs.forEach((env) => {
			describe(`when invalid nodenv of "${JSON.stringify(env)}"`, () => {
				it('throws error', () => {
					jest.resetModules();
					process.env.NODE_ENV = env;
					expect(import('./constants')).rejects.toThrowError();
				});
			});
		});
	});

	describe('isDev, isProd, isTest', () => {
		type Collection = {
			env: Nodenv;
			isProd: boolean;
			isTest: boolean;
			isDev: boolean;
			isIntegration: boolean;
		};

		const collections: Collection[] = [
			{ env: 'development', isProd: false, isTest: false, isDev: true, isIntegration: false },
			{ env: 'test', isProd: false, isTest: true, isDev: false, isIntegration: false },
			{ env: 'production', isProd: true, isTest: false, isDev: false, isIntegration: false },
			{ env: 'integration', isProd: true, isTest: false, isDev: false, isIntegration: true },
		];

		collections.forEach((collection) => {
			it(`when env is "${collection.env} env flags are set correctly`, async () => {
				jest.resetModules();
				process.env.NODE_ENV = collection.env;
				const { isDev, isProd, isTest, isIntegration } = await import('./constants');
				expect(isDev).toBe(collection.isDev);
				expect(isProd).toBe(collection.isProd);
				expect(isTest).toBe(collection.isTest);
				expect(isIntegration).toBe(collection.isIntegration);
			});
		});
	});

	describe('asset', () => {
		it('returns the asset location', async () => {
			jest.resetModules();
			const { asset } = await import('./constants');
			expect(asset('foo')).toBe(`${process.cwd()}/shared/foo`);
		});
	});
});
