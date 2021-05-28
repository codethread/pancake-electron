import { err, ok, Result } from '@shared/Result';
import { exampleUser } from '@test/fixtures/github';
import { _User } from '@shared/graphql';
import { createFakeBridge } from './createFakeBridge';

interface Test {
  response: Result<_User>;
  result: Result<_User>;
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
