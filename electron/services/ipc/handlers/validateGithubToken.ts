import { Repositories } from '@electron/repositories';
import { err, ok } from '@shared/Result';
import { Handlers } from '../Handlers';

export const validateGithubToken = ({
  githubRepository,
}: Repositories): Handlers['validateGithubToken'] => async (_, [token]) => {
  const res = await githubRepository.getTokenScopes(token);

  return res.flatMap((scopes) =>
    ['repo', 'read:org'].every((scope) => scopes.includes(scope)) ? ok(true) : err('missing scopes')
  );
};
