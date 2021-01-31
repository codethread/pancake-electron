/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function assertIsError(err: any): asserts err is Error {
  if (!(err instanceof Error)) throw err;
}
