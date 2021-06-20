import { GithubRepository, ServerStoreRepository } from '@electron/repositories';
import { err, ok } from '@shared/Result';
import { githubScopes } from '@shared/constants';
import { Handlers } from './Handlers';

export const errMessage = err<string, boolean>('missing scopes');

export const validateAndStoreGithubToken = ({
  githubRepository,
  serverStoreRepository,
}: GithubRepository & ServerStoreRepository): Handlers['validateAndStoreGithubToken'] => async (
  _,
  [token]
) => {
  const res = await githubRepository.getTokenScopes(token);

  const validationResult = res.flatMap((scopes) =>
    githubScopes.every((scope) => scopes.includes(scope)) ? ok(true) : errMessage
  );

  if (validationResult.ok) {
    serverStoreRepository.update({
      githubToken: token,
    });
  }

  return validationResult;
};
