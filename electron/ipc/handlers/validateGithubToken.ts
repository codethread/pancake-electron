import { Repositories } from '@electron/repositories';
import { err, ok } from '@shared/Result';
import { githubScopes } from '@shared/constants';
import { Handlers } from './Handlers';

export const errMessage = err<string, boolean>('missing scopes');

export const validateGithubToken = ({
  githubRepository,
}: Repositories): Handlers['validateGithubToken'] => async (_, [token]) => {
  const res = await githubRepository.getTokenScopes(token);

  return res.flatMap((scopes) =>
    githubScopes.every((scope) => scopes.includes(scope)) ? ok(true) : errMessage
  );
};
