const validNodenvs = ['production', 'development', 'test'] as const;

type Nodenv = typeof validNodenvs[number];

type URLS = {
  readonly main: string;
};

const nodenv = initNodenv(process.env.NODE_ENV || '');
const isDev = nodenv === 'development';
const isProd = nodenv === 'production';
const isTest = nodenv === 'test';
const urls: URLS = {
  main: 'http://localhost:4000',
};

export { isDev, isProd, isTest, urls };

function initNodenv(nodenv: string): Nodenv {
  assertValid(nodenv);
  return nodenv;

  function assertValid(env: string): asserts env is Nodenv {
    if (!validNodenvs.includes(env as Nodenv)) {
      throw new Error(`node_env of "${env}" is invalid`);
    }
  }
}
