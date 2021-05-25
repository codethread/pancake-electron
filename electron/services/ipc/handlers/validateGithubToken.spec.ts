import { ok } from '@shared/Result';
import { githubScopes } from '@shared/constants';
import { createFakeBridge } from './createFakeBridge';
import { errMessage } from './validateGithubToken';

jest.mock('@electron/services/logger');

describe('validateGithubToken', () => {
  test.each`
    title             | scopes                            | result
    ${'partial'}      | ${ok(['repo'])}                   | ${errMessage}
    ${'missing'}      | ${ok(['repo', 'foo'])}            | ${errMessage}
    ${'full'}         | ${ok(githubScopes)}               | ${ok(true)}
    ${'surplus full'} | ${ok(githubScopes.concat('foo'))} | ${ok(true)}
  `('when scopes are $title it should return $result.ok', async ({ scopes, result }) => {
    const bridge = createFakeBridge({
      githubRepository: {
        getTokenScopes: async () => Promise.resolve(scopes),
      },
    });

    const res = await bridge.validateGithubToken('1234');

    expect(res).toMatchResult(result);
  });
});
