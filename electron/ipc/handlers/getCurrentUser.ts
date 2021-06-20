import { GithubRepository, ServerStoreRepository } from '@electron/repositories';
import { Handlers } from './Handlers';

export const getCurrentUser = ({
  githubRepository,
  serverStoreRepository,
}: GithubRepository & ServerStoreRepository): Handlers['getCurrentUser'] => async () =>
  serverStoreRepository
    .read()
    .chain(async ({ githubToken }) => githubRepository.getCurrentUser(githubToken ?? ''));
