import { GithubRepository } from '@electron/repositories/github/github';
import { ok } from '@shared/Result';
import merge from 'lodash.merge';
import { githubScopes } from '@shared/constants';

export const fakeGithub = (overrides?: Partial<GithubRepository>): GithubRepository =>
  merge({}, fakes, overrides);

const fakes: GithubRepository = {
  async getTokenScopes() {
    return Promise.resolve(ok(githubScopes));
  },
};
