import { GithubRepository } from '@electron/repositories/github/github';
import { ok } from '@shared/Result';
import merge from 'lodash.merge';

export const fakeGithub = (overrides?: Partial<GithubRepository>): GithubRepository =>
  merge({}, fakes, overrides);

const fakes: GithubRepository = {
  async getTokenScopes() {
    return Promise.resolve(ok(['repo', 'read:org']));
  },
};
