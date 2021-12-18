import { ok } from '@shared/Result';
import { githubScopes } from '@shared/constants';
import { ServerStore } from '@shared/types';
import { createFakeBridge } from './createFakeBridge';
import { errMessage } from './validateAndStoreGithubToken';

jest.mock('@electron/services/logger');

describe('validateAndStoreGithubToken', () => {
  test.each`
    title             | scopes                            | result        | shouldStoreToken
    ${'partial'}      | ${ok(['repo'])}                   | ${errMessage} | ${false}
    ${'missing'}      | ${ok(['repo', 'foo'])}            | ${errMessage} | ${false}
    ${'full'}         | ${ok(githubScopes)}               | ${ok(true)}   | ${true}
    ${'surplus full'} | ${ok(githubScopes.concat('foo'))} | ${ok(true)}   | ${true}
  `(
    'when scopes are $title it should return $result.ok',
    async ({ scopes, result, shouldStoreToken }) => {
      const spy = jest.fn();

      const bridge = createFakeBridge({
        githubRepository: {
          getTokenScopes: async () => Promise.resolve(scopes),
        },
        serverStoreRepository: {
          update: spy,
        },
      });

      const res = await bridge.validateAndStoreGithubToken('1234');

      if (shouldStoreToken) {
        expect(spy).toHaveBeenCalledWith<ServerStore[]>({ githubToken: '1234' });
      } else {
        expect(spy).not.toHaveBeenCalledWith<ServerStore[]>({ githubToken: '1234' });
      }

      expect(res).toMatchResult(result);
    }
  );
});
