import { err, ok } from '@shared/Result';
import { createFakeBridge } from './createFakeBridge';

jest.mock('@electron/services/logger');
jest.mock('electron');

describe('validateGithubToken', () => {
  it('should reply with an ok if the token is valid', async () => {
    const bridge = createFakeBridge({
      githubRepository: {
        getTokenScopes: async () => Promise.resolve(ok(['repo', 'read:org'])),
      },
    });

    const res = await bridge.validateGithubToken('1234');

    expect(res).toMatchResult(ok(true));
  });

  it('should reply with a failure message if the token is invalid', async () => {
    const bridge = createFakeBridge({
      githubRepository: {
        getTokenScopes: async () => Promise.resolve(err('missing scopes')),
      },
    });

    const res = await bridge.validateGithubToken('1234');

    expect(res).toMatchResult(err('missing scopes'));
  });
});
