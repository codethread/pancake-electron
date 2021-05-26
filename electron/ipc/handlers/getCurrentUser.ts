import { Repositories } from '@electron/repositories';
import { Handlers } from './Handlers';

export const getCurrentUser = ({
  githubRepository,
}: Repositories): Handlers['getCurrentUser'] => async () => githubRepository.getCurrentUser();
