// import { nodenv, isDev, isProd, isTest } from './constants';

import { Nodenv } from './asserts';

describe('constants', () => {
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
            require('./constants');
          }).toThrowError();
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
    };

    const collections: Collection[] = [
      { env: 'development', isProd: false, isTest: false, isDev: true },
      { env: 'test', isProd: false, isTest: true, isDev: false },
      { env: 'production', isProd: true, isTest: false, isDev: false },
    ];

    collections.forEach((collection) => {
      describe(`when env is "${collection.env}`, () => {
        jest.resetModules();
        process.env.NODE_ENV = collection.env;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
        const { isDev, isProd, isTest } = require('./constants');
        expect(isDev).toBe(collection.isDev);
        expect(isProd).toBe(collection.isProd);
        expect(isTest).toBe(collection.isTest);
      });
    });
  });
});
