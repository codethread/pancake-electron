import { ClientStoreRepository } from '@electron/repositories';
import { IpcHandlers } from '@shared/types';

export const loadUserConfig = ({
  clientStoreRepository,
}: ClientStoreRepository): IpcHandlers['loadUserConfig'] => async () =>
  Promise.resolve(clientStoreRepository.read());

export const updateUserConfig = ({
  clientStoreRepository,
}: ClientStoreRepository): IpcHandlers['updateUserConfig'] => async (_, [config]) =>
  Promise.resolve(clientStoreRepository.update(config));

export const resetUserConfig = ({
  clientStoreRepository,
}: ClientStoreRepository): IpcHandlers['resetUserConfig'] => async () =>
  Promise.resolve(clientStoreRepository.reset());
