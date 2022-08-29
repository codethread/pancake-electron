export function not(predicate: boolean): boolean {
	return !predicate;
}
export function and(...predicate: boolean[]): boolean {
	return predicate.every((p) => p === true);
}

export function or(...predicate: boolean[]): boolean {
	return predicate.some((p) => p === true);
}

/**
 * true if no condition is true
 */
export function neither(...predicate: boolean[]): boolean {
	return predicate.every((p) => p === false);
}
