import { fakeGithub } from '@electron/repositories/github/fakeGithub';
import { ok } from '@shared/Result';
import { githubScopes } from '@shared/constants';
import { exampleUser } from '@test/fixtures/github';
import { merge } from '@shared/merge';

describe('fakeGithub', () => {
  describe('#getTokenScopes', () => {
    it('should return the required scopes for pancake', async () => {
      const scopes = await fakeGithub().getTokenScopes('');
      expect(scopes).toMatchResult(ok(githubScopes));
    });

    it('should be overridable', async () => {
      const scopes = await fakeGithub({
        getTokenScopes: async (token) => ok([`bearer ${token}`]),
      }).getTokenScopes('token');
      expect(scopes).toMatchResult(ok(['bearer token']));
    });
  });

  describe('#getCurrentUser', () => {
    it('should return a default user', async () => {
      const user = await fakeGithub().getCurrentUser('');
      expect(user).toMatchResult(ok(exampleUser));
    });

    it('should be overridable', async () => {
      const stub = merge(exampleUser, { viewer: { name: 'bono ' } });
      const scopes = await fakeGithub({
        getCurrentUser: async () => ok(stub),
      }).getCurrentUser('');
      expect(scopes).toMatchResult(ok(stub));
    });
  });
});
