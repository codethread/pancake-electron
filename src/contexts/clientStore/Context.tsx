import { createContext } from 'react';
import { SharedConfig, sharedConfig } from '../../../shared/sharedConfig';

interface Fetchers {
  login(_: string): Promise<void>;
  logout(): Promise<void>;
  getUser(): Promise<void>;
}

export interface IStoreContext {
  store: SharedConfig;
  fetch: Fetchers;
}

const tempFn = async (): Promise<void> =>
  Promise.reject(new Error('store not initialised'));

const defaultContext: IStoreContext = {
  store: sharedConfig,
  fetch: {
    login: tempFn,
    logout: tempFn,
    getUser: tempFn,
  },
};

export const StoreContext = createContext(defaultContext);
