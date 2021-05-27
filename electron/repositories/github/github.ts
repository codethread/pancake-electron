import { err, ok, Result } from '@shared/Result';
import got from 'got';
import { GetCurrentUser, GetCurrentUserQuery } from './generated/graphql';

export interface GithubRepository {
  getTokenScopes(token: string): Promise<Result<string[]>>;
  getCurrentUser(): Promise<Result<GetCurrentUserQuery>>;
}

const githubGraphql = 'https://api.github.com/graphql';

export const githubRepository = (): GithubRepository => ({
  async getCurrentUser() {
    const res = await got<GetCurrentUserQuery>(githubGraphql, {
      responseType: 'json',
      headers: {
        Authorization: `token ${process.env.GH_TOKEN ?? ''}`,
      },
      body: GetCurrentUser,
    });
    return ok(res.body);
    // const a: GetCurrentUserQuery = {};
    // githubGraphql({
    //   operationName: 'GetCurrentUser',
    //   variables: {},
    // });
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
