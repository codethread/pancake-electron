import axios from 'axios';
import { ILogger } from './logger';

const me = `query User {
  viewer {
    login
    name
    avatarUrl
    id
    company
  }
}
`;

export type User = {
  viewer: {
    login: string;
    name: string;
    avatarUrl: string;
    id: string;
    company: string;
  };
};

interface IGithub {
  readonly commonHeaders: Record<string, string>;
  getUser(): Promise<User>;
}

export class Github implements IGithub {
  readonly commonHeaders: IGithub['commonHeaders'];
  constructor(private logger: ILogger, token: string) {
    this.commonHeaders = {
      Authorization: `bearer ${token}`,
      'User-Agent': 'Pancake Electron',
      Accept: 'application/vnd.github.black-cat-preview+json',
    };
  }

  async getUser(): Promise<User> {
    this.logger.info('getting users');
    const res = await axios.post<{ data: User; errors?: string[] }>(
      'https://api.github.com/graphql',
      {
        query: me,
      },
      {
        headers: this.commonHeaders,
        responseType: 'json',
      }
    );
    console.log(res);
    return res.data.data;
  }
}

// const orgUsers = `query OrganizationUsers($login: String!, $after: String) {
//   ...rateLimit
//   organization(login: $login) {
//     membersWithRole(first: 10, after: $after) {
//       pageInfo {
//         hasNextPage
//         endCursor
//       }
//       nodes {
//         name
//         avatarUrl
//         id
//         login
//       }
//     }
//   }
// }
//
// fragment rateLimit on Query {
//   rateLimit {
//     limit
//     cost
//     nodeCount
//     remaining
//     resetAt
//   }
// }`;
