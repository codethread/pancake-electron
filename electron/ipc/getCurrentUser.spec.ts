import { err, ok, Result } from '@shared/Result';
import { exampleUser } from '@test/fixtures/github';
import { _User } from '@shared/graphql';
import { ServerStore } from '@shared/types';
import { createFakeBridge } from './createFakeBridge';

interface Test {
  response: Result<_User>;
  result: Result<_User>;
  store: Result<ServerStore>;
}

jest.mock('@electron/services/logger');

describe('getCurrentUser', () => {
  test.each`
    title                                | store                         | response           | result
    ${'when no user, it returns an err'} | ${ok({ githubToken: 'foo' })} | ${err('no user')}  | ${err('no user')}
    ${'when a user, it returns user'}    | ${ok({ githubToken: 'foo' })} | ${ok(exampleUser)} | ${ok(exampleUser)}
    ${'when no user, it returns an err'} | ${ok({})}                     | ${err('no user')}  | ${err('no user')}
    ${'when a user, it returns user'}    | ${err('no user')}             | ${ok(exampleUser)} | ${err('no user')}
  `('$title', async ({ response, result, store }: Test) => {
    const bridge = createFakeBridge({
      githubRepository: {
        getCurrentUser: async () => response,
      },
      serverStoreRepository: {
        read: () => store,
      },
    });

    const res = await bridge.getCurrentUser();

    expect(res).toMatchResult(result);
  });
});
