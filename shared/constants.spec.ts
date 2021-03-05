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
          expect(() => {
            // eslint-disable-next-line global-require
            require('./constants');
          }).not.toThrowError();
        });
      });
    });

    const invalidNodenvs = ['', undefined, 'dev', 'true', 'false', ' '];

    invalidNodenvs.forEach((env) => {
      describe(`when invalid nodenv of "${JSON.stringify(env)}"`, () => {
        it('throws error', () => {
          jest.resetModules();
          process.env.NODE_ENV = env;
          expect(() => {
            // eslint-disable-next-line global-require
            require('./constants');
          }).toThrowError();
        });
      });
    });
  });

  describe('isDev, isProd, isTest', () => {
    interface Collection {
      env: Nodenv;
      isProd: boolean;
      isTest: boolean;
      isDev: boolean;
    }

    const collections: Collection[] = [
      { env: 'development', isProd: false, isTest: false, isDev: true },
      { env: 'test', isProd: false, isTest: true, isDev: false },
      { env: 'production', isProd: true, isTest: false, isDev: false },
    ];

    collections.forEach((collection) => {
      it(`when env is "${collection.env} env flags are set correctly`, () => {
        jest.resetModules();
        process.env.NODE_ENV = collection.env;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires, global-require
        const { isDev, isProd, isTest } = require('./constants');
        expect(isDev).toBe(collection.isDev);
        expect(isProd).toBe(collection.isProd);
        expect(isTest).toBe(collection.isTest);
      });
    });
  });

  describe('isIntegration', () => {
    describe('when not in production mode', () => {
      it('is always false', () => {
        process.env.NODE_ENV = 'development';
        process.env.INTEGRATION = 'true';

        jest.resetModules();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires, global-require
        const { isIntegration } = require('./constants');
        expect(isIntegration).toBe(false);
      });
    });

    describe('when in production mode', () => {
      describe('when INTEGRATION is true', () => {
        it('is is true', () => {
          process.env.NODE_ENV = 'production';
          process.env.INTEGRATION = 'true';

          jest.resetModules();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires, global-require
          const { isIntegration } = require('./constants');
          expect(isIntegration).toBe(true);
        });
      });

      describe('when INTEGRATION is false', () => {
        it('is is true', () => {
          process.env.NODE_ENV = 'production';
          process.env.INTEGRATION = 'false';

          jest.resetModules();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires, global-require
          const { isIntegration } = require('./constants');
          expect(isIntegration).toBe(false);
        });
      });
    });
  });
});
