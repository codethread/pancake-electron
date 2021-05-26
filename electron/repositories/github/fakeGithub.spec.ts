import { fakeGithub } from '@electron/repositories/github/fakeGithub';
import { ok } from '@shared/Result';
import { githubScopes } from '@shared/constants';

describe('fakeGithub', () => {
  describe('#getTokenScopes', () => {
    it('should return the required scopes for pancake', async () => {
      const scopes = await fakeGithub().getTokenScopes('');
      expect(scopes).toMatchResult(ok(githubScopes));
    });

    it('should be overridable', async () => {
      const scopes = await fakeGithub({
        getTokenScopes: async (token) => Promise.resolve(ok([`token${token}`])),
      }).getTokenScopes('token');
      expect(scopes).toMatchResult(ok(['tokentoken']));
    });
  });
});
