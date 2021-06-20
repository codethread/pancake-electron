import Store from 'electron-store';
import { DeepPartial } from '@shared/tsHelpers';
import { err, ok, Result } from '@shared/Result';
import { logger } from '@electron/services';
import { getKeyPathsAndValues } from './getKeyPathsAndValues';

export interface StoreRepository<T> {
  read(): Result<T>;
  update(value: DeepPartial<T>): Result<T>;
}

export interface StoreConfig<T> {
  /**
   * Name of the config file to be created
   *
   * e.g `Foo` will become Foo.json
   */
  name: string;
  /**
   * Directory for the config file, sensible default for Operating System if none provided
   */
  cwd?: string;
  /**
   * Initial values for config, if no config file exists
   */
  defaults: T;
}

export const storeRepository = <T>(storeConfig: StoreConfig<T>): StoreRepository<T> => {
  const { name, cwd } = storeConfig;

  /* istanbul ignore next */
  logger.info(`setting up Store Repo: name ${name}${cwd ? `cwd ${cwd}` : ''}`);

  const store = new Store<T>(storeConfig);
  return {
    read() {
      return ok(store.store);
    },
    update(updatedStore) {
      const originalStore = store.store;
      try {
        getKeyPathsAndValues(updatedStore).forEach(([path, value]) => {
          store.set(path, value);
        });
        return ok(store.store);
      } catch (e: unknown) {
        logger.warn(
          `failed to update store "${name}", err:\n${
            /* istanbul ignore next */
            e instanceof Error ? e.message : 'unknownError'
          }`
        );
        store.set(originalStore);
        return err('failed to update');
      }
    },
  };
};
