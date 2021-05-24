import _merge from 'lodash.merge';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
// export const merge = <T>(...args: T[]): T => _merge({}, ...args);
export const merge = <A, B>(a: A, b: B): A & B => _merge({}, a, b);
