import { err, ok, Result } from '@shared/Result';
import got from 'got';

export interface GithubRepository {
  getTokenScopes(token: string): Promise<Result<string[]>>;
}

export const githubRepository = (): GithubRepository => ({
  async getTokenScopes(token: string): Promise<Result<string[]>> {
    try {
      const { headers } = await got('https://api.github.com', {
        headers: {
          Authorization: `token ${token}`,
        },
      });

      const scopes = toArr(headers['x-oauth-scopes'] ?? []);

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
