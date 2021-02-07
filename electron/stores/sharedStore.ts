import Store from 'electron-store';
import { isProd } from '../utils/constants';
import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { ipcEvents } from '../../shared/ipcEvents';
import { ILogger } from '../services';
import { ServerStore } from './serverStore';
import { Github } from '../services/github';
import { SharedConfig } from '../../shared/sharedConfig';

export type SharedStore = Store<SharedConfig>;

export function createSharedStore(
  logger: ILogger,
  serverStore: ServerStore
): SharedStore {
  logger.info('creating shared store');

  const sharedStore = new Store<SharedConfig>({
    accessPropertiesByDotNotation: false,
    name: 'shared',
    ...(!isProd && { cwd: process.cwd() + '/temp' }),
  });

  ipcMain.handle(ipcEvents.LOGIN, login(logger, sharedStore, serverStore));
  ipcMain.handle(ipcEvents.LOGOUT, logout(logger, sharedStore, serverStore));
  ipcMain.handle(ipcEvents.SS_READ, readStore(logger, sharedStore));
  ipcMain.handle(ipcEvents.GET_USER, getUser(logger, sharedStore, serverStore));

  return sharedStore;
}

function login(
  logger: ILogger,
  sharedStore: SharedStore,
  privateStore: ServerStore
) {
  return (_: IpcMainInvokeEvent, token: string) => {
    logger.info('storing github token');
    try {
      privateStore.set('ghToken', token);
      sharedStore.set('loggedIn', true);
      return Promise.resolve(sharedStore.store);
    } catch (e) {
      logger.error('unable to store token', e);
      return Promise.reject(e);
    }
  };
}

function logout(
  logger: ILogger,
  sharedStore: SharedStore,
  privateStore: ServerStore
) {
  return (_: IpcMainInvokeEvent) => {
    logger.info('deleting ghToken');
    try {
      privateStore.delete('ghToken');
      sharedStore.set('loggedIn', false);
      return Promise.resolve(sharedStore.store);
    } catch (e) {
      logger.error('unable to delete token', e);
      return Promise.reject(e);
    }
  };
}

function readStore(logger: ILogger, sharedStore: SharedStore) {
  return async (_: IpcMainInvokeEvent) => {
    logger.info('reading sharedStore');
    try {
      return Promise.resolve(sharedStore.store);
    } catch (e) {
      logger.error('unable to read sharedStore', e);
      return Promise.reject(e);
    }
  };
}

function getUser(
  logger: ILogger,
  sharedStore: SharedStore,
  serverStore: ServerStore
) {
  return async (_: IpcMainInvokeEvent) => {
    const token = serverStore.get('ghToken');
    if (!token) throw new Error('user not signed in');
    logger.info('fetching current user');
    try {
      const github = new Github(logger, token);
      const user = await github.getUser();
      sharedStore.set('user', user);
      return sharedStore.store;
    } catch (e) {
      logger.error('unable to read sharedStore', e);
      return Promise.reject(e);
    }
  };
}
// export const obfuscatedKeys: Array<keyof ServerConfig> = ['ghToken'];
//
// function obfuscateForLog(config: ServerConfig): string {
//   return JSON.stringify(
//     Object.fromEntries(
//       Object.entries(config).map(([key, value]) =>
//         obfuscatedKeys.includes(key as keyof ServerConfig)
//           ? [key, obfuscateValue(value)]
//           : [key, value]
//       )
//     )
//   );
// }
//
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// function obfuscateValue(value: any): string {
//   return value ? JSON.stringify(value).replace(/./g, '*') : 'undefined';
// }
