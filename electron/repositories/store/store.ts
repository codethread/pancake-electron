import Store from 'electron-store';
import { DeepPartial } from '@shared/tsHelpers';
import { err, ok, Result } from '@shared/Result';
import { getKeyPathsAndValues } from './getKeyPathsAndValues';

// type Scalar = boolean | number | string | null | undefined;

// type ToNull<Type> = {
//   [Property in keyof Type]?: Type[Property] extends Scalar ? null : ToNull<Type[Property]>;
// };

// export type AnyJson = JsonArray | JsonMap | boolean | number | string | null;
// export interface JsonMap {
//   [key: string]: AnyJson;
// }
// type JsonArray = Array<AnyJson>;

export interface StoreRepository<T> {
  read(): Result<T>;
  update(value: DeepPartial<T>): Result<T>;
  // reset(keyObject: ToNull<T>): Result<T>;
}

export interface StoreConfig<T> {
  name: string;
  cwd?: string;
  defaults?: T;
}

export const storeRepository = <T>(storeConfig: StoreConfig<T>): StoreRepository<T> => {
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
      } catch (_: unknown) {
        store.set(originalStore);
        return err('failed to update');
      }
    },
    // reset() {
    //   return ok({} as T);
    // },
  };
};
