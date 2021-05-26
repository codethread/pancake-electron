import { fakeGithub } from '@electron/repositories/github/fakeGithub';
import { ok } from '@shared/Result';
import { githubScopes } from '@shared/constants';
import { exampleUser } from '@test/fixtures/github';

describe('fakeGithub', () => {
  describe('#getTokenScopes', () => {
    it('should return the required scopes for pancake', async () => {
      const scopes = await fakeGithub().getTokenScopes('');
      expect(scopes).toMatchResult(ok(githubScopes));
    });

    it('should be overridable', async () => {
      const scopes = await fakeGithub({
        getTokenScopes: async (token) => ok([`token${token}`]),
      }).getTokenScopes('token');
      expect(scopes).toMatchResult(ok(['tokentoken']));
    });
  });

  describe('#getCurrentUser', () => {
    it('should return a default user', async () => {
      const user = await fakeGithub().getCurrentUser();
      expect(user).toMatchResult(ok({ data: { user: exampleUser } }));
    });

    it('should be overridable', async () => {
      const stub = { data: { user: { ...exampleUser, name: 'Bono' } } };
      const scopes = await fakeGithub({
        getCurrentUser: async () => ok(stub),
      }).getCurrentUser();
      expect(scopes).toMatchResult(ok(stub));
    });
  });
});
