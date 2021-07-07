import { GithubRepository, ServerStoreRepository } from '@electron/repositories';
import { IpcHandlers } from '@shared/types';

export const getCurrentUser = ({
  githubRepository,
  serverStoreRepository,
}: GithubRepository & ServerStoreRepository): IpcHandlers['getCurrentUser'] => async () =>
  serverStoreRepository
    .read()
    .chain(async ({ githubToken }) => githubRepository.getCurrentUser(githubToken ?? ''));
