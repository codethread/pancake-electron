import { err, ok, Result } from '@shared/Result';
import got from 'got';
import { _User, _UserRequest } from '@shared/graphql';

export interface GithubRepository {
  getTokenScopes(token: string): Promise<Result<string[]>>;
  getCurrentUser(token: string): Promise<Result<_User>>;
}

export interface GQL<ResponseData> {
  data: ResponseData;
  errors?: [
    {
      message: string;
      path: [string];
      extensions: { [key: string]: never };
      locations: [
        {
          line: number;
          column: number;
        }
      ];
    }
  ];
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const graphqlReq = (token: string) => <A>(query: string) =>
  got.post<GQL<A>>('https://api.github.com/graphql', {
    responseType: 'json',
    headers: {
      Authorization: `token ${token}`,
    },
    json: { query },
  });

export const githubRepository = (): GithubRepository => ({
  async getCurrentUser(token) {
    try {
      const res = await graphqlReq(token)<_User>(_UserRequest);

      const { errors, data } = res.body;
      return errors?.length ? err('could not get user') : ok(data);
    } catch (_: unknown) {
      return err('could not communicate with github server');
    }
  },

  async getTokenScopes(token: string) {
    try {
      const { headers } = await got.get('https://api.github.com', {
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
