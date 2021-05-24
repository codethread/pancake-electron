/* eslint-disable no-redeclare */
// based on rust's Result Enum, this is a really basic functor and would probably make someone who knows FP cry

export type Result<O, E = string> = Err<O, E> | Ok<O, E>;

export const ok = <O, E = string>(arg: O): Ok<O, E> => ({
  ok: true,
  val: arg,
  map: (cb) => ok(cb(arg)),
  errMap: () => ok(arg),
  flatMap: (cb) => cb(arg),
  chain: async (cb) => cb(arg),
  unwrap: ({ Ok }) => Ok(arg),
});

export const err = <E = string, O = string>(arg: E): Err<O, E> => ({
  ok: false,
  reason: arg,
  map: () => err(arg),
  errMap: (cb) => err(cb(arg)),
  flatMap: () => err(arg),
  chain: async () => Promise.resolve(err(arg)),
  unwrap: ({ Err }) => Err(arg),
});

// TODO there is an issue in here if you try to flatMap from two different error types, but I've spent too long on this already and most useful functionality is there
export interface Err<O, E = string> {
  ok: false;
  reason: E;
  map: <A>(cb: (arg: O) => A) => Result<A, E>;
  errMap: (cb: (arg: E) => E) => Result<O, E>;
  flatMap: <A>(cb: (arg: O) => Result<A, E>) => Result<A, E>;
  chain: <A>(cb: (arg: O) => Promise<Result<A, E>>) => Promise<Result<A, E>>;
  unwrap: <R, T>(handlers: { Err: (e: E) => R; Ok: (o: O) => T }) => R;
}

export interface Ok<O, E = string> {
  ok: true;
  val: O;
  map: <A>(cb: (arg: O) => A) => Result<A, E>;
  errMap: (cb: (arg: E) => E) => Result<O, E>;
  flatMap: <A>(cb: (arg: O) => Result<A, E>) => Result<A, E>;
  chain: <A>(cb: (arg: O) => Promise<Result<A, E>>) => Promise<Result<A, E>>;
  unwrap: <R, T>(handlers: { Err: (e: E) => R; Ok: (o: O) => T }) => T;
}

export const isErr = <O, E>(result: Result<O, E>): result is Err<O, E> => !result.ok;
export const isOk = <O, E>(result: Result<O, E>): result is Ok<O, E> => result.ok;

export function tupleResult<A, B, C>(
  result1: Result<A, B>,
  result2: Result<C, B>
): Result<[A, C], B> {
  return result1.flatMap((ok1) => result2.map((ok2) => [ok1, ok2]));
}