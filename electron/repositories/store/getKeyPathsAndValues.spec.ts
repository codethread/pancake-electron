import { AnyObject } from '@shared/types';
import { getKeyPathsAndValues } from './getKeyPathsAndValues';

describe('getKeyPathsAndValues', () => {
  type Test = [input: AnyObject, result: ReturnType<typeof getKeyPathsAndValues>];
  const tests: Test[] = [
    [{}, []],
    [{ foo: 'bar' }, [['foo', 'bar']]],
    [
      { foo: 'bar', baz: 4 },
      [
        ['foo', 'bar'],
        ['baz', 4],
      ],
    ],
    [
      { foo: 'bar', baz: null, a: null, ping: false, 3: '' },
      [
        ['3', ''],
        ['foo', 'bar'],
        ['baz', null],
        ['a', null],
        ['ping', false],
      ],
    ],
    [{ foo: [1, 2, 3] }, [['foo', [1, 2, 3]]]],
    [{ foo: [1, { x: 'y' }, 3] }, [['foo', [1, { x: 'y' }, 3]]]],
    [
      { foo: { bar: 3 }, baz: true },
      [
        ['foo.bar', 3],
        ['baz', true],
      ],
    ],
    [
      { foo: { bar: { baz: 4 } }, baz: true },
      [
        ['foo.bar.baz', 4],
        ['baz', true],
      ],
    ],
    [
      {
        x: null,
        foo: {
          bar: {
            baz: 4,
            baz2: 'bye',
          },
          a: 3,
          b: { c: { d: 'hi' } },
        },
        baz: { foo: 'bar' },
      },
      [
        ['x', null],
        ['foo.bar.baz', 4],
        ['foo.bar.baz2', 'bye'],
        ['foo.a', 3],
        ['foo.b.c.d', 'hi'],
        ['baz.foo', 'bar'],
      ],
    ],
  ];
  test.each(tests)('should do what it says on the tin', (input, result) => {
    expect(getKeyPathsAndValues(input)).toStrictEqual(result);
  });
});
