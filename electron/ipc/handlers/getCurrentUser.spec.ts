import { err, ok, Result } from '@shared/Result';
import { User } from '@shared/types';
import { exampleUser } from '@test/fixtures/github';
import { createFakeBridge } from './createFakeBridge';

interface Test {
  response: Result<User>;
  result: Result<User>;
}

jest.mock('@electron/services/logger');

describe('getCurrentUser', () => {
  test.each`
    title                                | response           | result
    ${'when no user, it returns an err'} | ${err('no user')}  | ${err('no user')}
    ${'when a user, it returns user'}    | ${ok(exampleUser)} | ${ok(exampleUser)}
  `('$title', async ({ response, result }: Test) => {
    const bridge = createFakeBridge({
      githubRepository: {
        getCurrentUser: async () => response,
      },
    });

    const res = await bridge.getCurrentUser();

    expect(res).toMatchResult(result);
  });
});
