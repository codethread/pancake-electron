import { GithubRepository } from '@electron/repositories/github/github';
import { ok } from '@shared/Result';
import merge from 'lodash.merge';
import { githubScopes } from '@shared/constants';
import { exampleUser } from '@test/fixtures/github';

export const fakeGithub = (overrides?: Partial<GithubRepository>): GithubRepository =>
  merge({}, fakes, overrides);

const fakes: GithubRepository = {
  async getTokenScopes() {
    return Promise.resolve(ok(githubScopes));
  },
  async getCurrentUser() {
    return Promise.resolve(
      ok({
        data: {
          user: exampleUser,
        },
      })
    );
  },
};
