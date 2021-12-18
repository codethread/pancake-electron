import { err, ok, Result } from '@shared/Result';
import { createFakeBridge } from '@electron/ipc/createFakeBridge';
import { UserStore } from '@shared/types';

interface Test {
  response: Result<UserStore>;
  result: Result<UserStore>;
}

jest.mock('@electron/services/logger');

describe('loadUserConfig', () => {
  test.each`
    title                                       | response       | result
    ${'returns whatever comes back from store'} | ${err('poop')} | ${err('poop')}
    ${'returns whatever comes back from store'} | ${ok('hi')}    | ${ok('hi')}
  `('$title', async ({ response, result }: Test) => {
    const bridge = createFakeBridge({
      clientStoreRepository: {
        read: () => response,
      },
    });

    const res = await bridge.loadUserConfig();

    expect(res).toMatchResult(result);
  });
});

describe('updateUserConfig', () => {
  test.each`
    title                                  | response       | result
    ${'returns false when update fails'}   | ${err('poop')} | ${err('poop')}
    ${'returns true when update succeeds'} | ${ok('hi')}    | ${ok('hi')}
  `('$title', async ({ response, result }: Test) => {
    const bridge = createFakeBridge({
      clientStoreRepository: {
        update: () => response,
      },
    });

    const res = await bridge.updateUserConfig({ filters: [] });

    expect(res).toMatchResult(result);
  });
});

describe('resetUserConfig', () => {
  test.each`
    title                                       | response       | result
    ${'returns whatever comes back from store'} | ${err('poop')} | ${err('poop')}
    ${'returns whatever comes back from store'} | ${ok('hi')}    | ${ok('hi')}
  `('$title', async ({ response, result }: Test) => {
    const bridge = createFakeBridge({
      clientStoreRepository: {
        reset: () => response,
      },
    });

    const res = await bridge.resetUserConfig();

    expect(res).toMatchResult(result);
  });
});
