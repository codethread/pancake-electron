import { GithubRepository } from '@electron/repositories';
import { Handlers } from './Handlers';

export const getCurrentUser = ({
  githubRepository,
}: GithubRepository): Handlers['getCurrentUser'] => async (_, [token]) =>
  githubRepository.getCurrentUser(token);
