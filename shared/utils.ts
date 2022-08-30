export function not(predicate: unknown): boolean {
	return !predicate;
}
export function and(...predicate: unknown[]): boolean {
	return predicate.every((p) => Boolean(p) === true);
}

export function or(...predicate: unknown[]): boolean {
	return predicate.some((p) => Boolean(p) === true);
}

/**
 * true if no condition is true
 */
export function neither(...predicate: unknown[]): boolean {
	return predicate.every((p) => Boolean(p) === false);
}
