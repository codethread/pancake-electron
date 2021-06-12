import { Handlers } from '@electron/ipc/handlers/Handlers';
import { err } from '@shared/Result';

export const loadUserConfig = ({
  storeRepository,
}: StoreRepository): Handlers['loadUserConfig'] => async () => Promise.resolve(err('file corrupt'));
