import _merge from 'lodash.merge';

export const merge = <A, B>(a: A, b: B): A & B => _merge({}, a, b);
