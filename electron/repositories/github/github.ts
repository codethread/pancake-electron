import { err, ok, Result } from '@shared/Result';
import got from 'got';
import { User } from '@shared/types';

interface GithubUser {
  data: {
    user: User;
  };
}

export interface GithubRepository {
  getTokenScopes(token: string): Promise<Result<string[]>>;
  getCurrentUser(): Promise<Result<GithubUser>>;
}

export const githubRepository = (): GithubRepository => ({
  async getCurrentUser() {
    throw new Error('not implemented');
    githubGraphql({
      operationName: 'GetCurrentUser',
      variables: {},
    });
  },
  async getTokenScopes(token: string) {
    try {
      const { headers } = await got('https://api.github.com', {
        headers: {
          Authorization: `token ${token}`,
        },
      });

      const scopes = toArr(headers['x-oauth-scopes'] ?? [])
        .filter(Boolean)
        .map((s) => s.trim());

      if (scopes.length === 0) return err('no scopes for token');

      return ok(scopes);
    } catch (_: unknown) {
      return err('no scopes for token');
    }
  },
});

function toArr(scopes: string[] | string): string[] {
  if (Array.isArray(scopes)) return scopes;
  return scopes.split(',');
}
