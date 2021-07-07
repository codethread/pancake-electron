import { IpcMain } from '@electron/electron';
import { Repositories } from '@electron/repositories';
import { logger } from '@electron/services/logger';
import { Result, strip } from '@shared/Result';
import { IpcHandlers } from '@shared/types';
import { handlerMethods } from '@shared/ipcHandlerMethods';
import {
  getCurrentUser,
  loadUserConfig,
  openGithubForTokenSetup,
  resetUserConfig,
  updateUserConfig,
  validateAndStoreGithubToken,
} from './handlers';

export function setupIpcHandlers(ipcMain: IpcMain, repos: Repositories): void {
  const loadedHandlers = handlers(repos);

  Object.entries(handlerMethods).forEach(([key, { main }]) => {
    switch (main) {
      case 'handle':
        ipcMain.handle(key, async (event, args) => {
          // @ts-expect-error shouldn't ever get an error because of the IpcSetup type
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
          const result: Result<unknown> = await loadedHandlers[key](event, args);
          return strip(result);
        });
        break;
      case 'on':
        ipcMain.on(key, (event, args) => {
          // @ts-expect-error shouldn't ever get an error because of the IpcSetup type
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          loadedHandlers[key](event, args);
        });
        break;
      default:
        throw new Error('impossible missing method for ipc handler methods');
    }
  });
}

function handlers(repos: Repositories): IpcHandlers {
  return {
    test: (_, msg) => {
      logger.info('IPC', ...msg);
    },
    info: (_, msg) => {
      logger.info('IPC', ...msg);
    },
    error: (_, msg) => {
      logger.error('IPC', ...msg);
    },
    getCurrentUser: getCurrentUser(repos),
    validateAndStoreGithubToken: validateAndStoreGithubToken(repos),
    openGithubForTokenSetup: openGithubForTokenSetup(repos),
    loadUserConfig: loadUserConfig(repos),
    updateUserConfig: updateUserConfig(repos),
    resetUserConfig: resetUserConfig(repos),
  };
}
