import { err, ok } from '@shared/Result';
import merge from 'lodash.merge';
import type { StoreRepo, StoreRepository } from './store';

export const fakeStoreRepoFactory = <T>({ storeConfig }: StoreRepo<T>): StoreRepository<T> => {
	let store = { ...storeConfig.defaults };
	return {
		async storeRead() {
			return Promise.resolve(ok(store));
		},
		async storeUpdate(updatedStore) {
			// mimic real store behaviour
			const anyUndefined = Object.values(updatedStore).some((v) => v === undefined);
			if (anyUndefined) {
				return Promise.resolve(err('failed to update'));
			}

			merge(store, updatedStore);
			return Promise.resolve(ok(store));
		},
		async storeDelete(key) {
			delete store[key];
			return Promise.resolve(ok(store));
		},
		async storeReset() {
			store = { ...storeConfig.defaults };
			return Promise.resolve(ok(store));
		},
	};
};
