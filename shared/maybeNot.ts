import { traverse } from './traverse';
// prettier-ignore
/**
 * Deeply Clean up any generated type
 *
 * The typescript-graphql generator is technically correct, but it's a little enthusiastic about it's bookkeeping
 * null, undefined and missing keys are different things, but realistically we just treat all of these as nil, so this
 * tidies up the horrible signature, as well as removing any nulls from arrays - because that's just dumb
 */
export type MaybeNot<T> =
    T extends never ? never
  : T extends Array<infer Y | null | undefined> ? Array<MaybeNot<Y>>
  // : T extends object ? { [P in keyof T]?: MaybeNot<T[P]> }
  : T extends object ? { [P in keyof T]: MaybeNot<T[P]> }
  : NonNullable<T>

/**
 * Deeply Clean up any generated type
 *
 * The typescript-graphql generator is technically correct, but it's a little enthusiastic about it's bookkeeping
 * null, undefined and missing keys are different things, but realistically we just treat all of these as nil, so this
 * tidies up the horrible signature, as well as removing any nulls from arrays - because that's just dumb
 */
export function maybeNot<A extends object>(gqlData: A): MaybeNot<A> {
	return traverse(gqlData, (i) => {
		if (i === null) return undefined;
		return i;
	});
}
