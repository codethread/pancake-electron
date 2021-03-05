/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function assertIsError(err: any): asserts err is Error {
  if (!(err instanceof Error)) throw err;
}

export const validNodenvs = ['production', 'development', 'test'] as const;

export type Nodenv = typeof validNodenvs[number];

export function assertValidNodenv(env: string): asserts env is Nodenv {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  if (!validNodenvs.includes(env as Nodenv)) {
    throw new Error(`node_env of "${env}" is invalid`);
  }
}
