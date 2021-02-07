import { ipcMain, IpcMainInvokeEvent } from 'electron';
import Store from 'electron-store';
import { isProd } from '../utils/constants';
import { ILogger } from '../services';
import { clientConfig, ClientConfig } from '../../shared/clientConfig';
import { ipcEvents } from '../../shared/ipcEvents';

type ClientConfigKey = keyof ClientConfig;
type ClientStore = Store<ClientConfig>;

export function createClientStore(logger: ILogger): ClientStore {
  logger.info('creating client store');

  const store = new Store<ClientConfig>({
    accessPropertiesByDotNotation: false,
    name: 'client',
    ...(!isProd && { cwd: process.cwd() + '/temp' }),
    defaults: clientConfig,
  });

  ipcMain.handle(ipcEvents.CLIENT_STORE_GET_ALL, storeGetAll(logger, store));
  ipcMain.handle(ipcEvents.CLIENT_STORE_GET_KEY, storeGetKey(logger, store));
  ipcMain.handle(ipcEvents.CLIENT_STORE_SET_KEY, storeSetKey(logger, store));
  ipcMain.handle(
    ipcEvents.CLIENT_STORE_RESET_KEY,
    storeResetKey(logger, store)
  );

  return store;
}

function storeGetAll(logger: ILogger, store: ClientStore) {
  return async () => {
    logger.info(`reading whole store`);
    try {
      const wholeStore = store.store;
      logger.info('read store', JSON.stringify(wholeStore));
      return Promise.resolve(wholeStore);
    } catch (e) {
      logger.error('read store ERR', e);
      return Promise.reject(e);
    }
  };
}

function storeGetKey(logger: ILogger, store: ClientStore) {
  return async <T extends ClientConfigKey>(
    _: IpcMainInvokeEvent,
    key: T,
    defaultValue?: ClientConfig[T]
  ) => {
    logger.info(`reading key: "${key}"`);
    try {
      const value = provided<ClientConfig[T]>(defaultValue)
        ? store.get(key as never, defaultValue) // TODO I have no idea what's going on here
        : store.get(key);

      logger.info('read value:', JSON.stringify(value));
      return Promise.resolve(value);
    } catch (e) {
      logger.error('read ERR', e);
      return Promise.reject(e);
    }
  };
}

function storeSetKey(logger: ILogger, store: ClientStore) {
  return async <T extends ClientConfigKey>(
    _: IpcMainInvokeEvent,
    key: T,
    value: ClientConfig[T]
  ) => {
    logger.info(`setting key: "${key}" with value: ${JSON.stringify(value)}`);
    try {
      store.set(key, value);
      ipcMain.emit('changed', key, value);
      return Promise.resolve(value);
    } catch (e) {
      logger.error('write ERR', e);
      return Promise.reject(e);
    }
  };
}

function storeResetKey(logger: ILogger, store: ClientStore) {
  return async (_: IpcMainInvokeEvent, key: ClientConfigKey) => {
    logger.info(`resetting key: "${key}"`);
    try {
      if (clientConfig[key] === undefined) {
        store.delete(key);
      } else {
        store.reset(key);
      }
      const resetValue = store.get(key);
      logger.info(`reset key: "${key}" to: ${JSON.stringify(resetValue)}`);
      return Promise.resolve(resetValue);
    } catch (e) {
      logger.error('reset ERR', e);
      return Promise.reject(e);
    }
  };
}

function provided<T>(x: unknown): x is T {
  return x !== null && x !== undefined;
}
