import { ClientStoreRepository } from '@electron/repositories';
import { ok } from '@shared/Result';
import { Handlers } from './Handlers';

export const loadUserConfig = ({
  clientStoreRepository,
}: ClientStoreRepository): Handlers['loadUserConfig'] => async () =>
  Promise.resolve(clientStoreRepository.read());

export const updateUserConfig = ({
  clientStoreRepository,
}: ClientStoreRepository): Handlers['updateUserConfig'] => async (_, [config]) =>
  Promise.resolve(
    clientStoreRepository.update(config).match({
      Err: () => ok(true),
      Ok: () => ok(false),
    })
  );
