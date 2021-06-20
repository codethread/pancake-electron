import { ClientStoreRepository } from '@electron/repositories';
import { Handlers } from './Handlers';

export const loadUserConfig = ({
  clientStoreRepository,
}: ClientStoreRepository): Handlers['loadUserConfig'] => async () =>
  Promise.resolve(clientStoreRepository.read());

export const updateUserConfig = ({
  clientStoreRepository,
}: ClientStoreRepository): Handlers['updateUserConfig'] => async (_, [config]) =>
  Promise.resolve(clientStoreRepository.update(config));
