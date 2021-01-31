import { assertIsError, assertValidNodenv, validNodenvs } from './asserts';

describe('asserts', () => {
  test('assertIsError', () => {
    expect(() => assertIsError('')).toThrowError();
    expect(() => assertIsError(new Error())).not.toThrowError();
  });

  test('assertValidNodenv', () => {
    validNodenvs.forEach((valid) => {
      expect(() => assertValidNodenv(valid)).not.toThrowError();
    });
    validNodenvs.forEach((valid) => {
      expect(() => assertValidNodenv(valid)).not.toThrowError();
    });
    const invalid = ['', 'integration', 'staging', ' '];
    invalid.forEach((invalid) => {
      expect(() => assertValidNodenv(invalid)).toThrowError();
    });
  });
});
