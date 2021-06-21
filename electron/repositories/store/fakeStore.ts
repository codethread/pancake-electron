import { ok } from '@shared/Result';
import merge from 'lodash.merge';
import { StoreConfig, StoreRepository } from './store';

export const fakeStoreRepoFactory = <T>(storeConfig: StoreConfig<T>): StoreRepository<T> => {
  let store = storeConfig.defaults;
  return {
    read() {
      return ok(store);
    },
    update(updatedStore) {
      merge(store, updatedStore);
      return ok(store);
    },
    reset() {
      store = storeConfig.defaults;
      return ok(store);
    },
  };
};
