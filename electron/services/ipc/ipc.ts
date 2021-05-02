// eslint-disable-next-line import/no-extraneous-dependencies
import { IpcMain, IpcMainEvent } from 'electron';
import { IBridge } from '@shared/types';
import { logger } from '../logger';
import { IShellRepository } from '../../repositories/ShellRepository';

export function setupIpcHandlers(
  ipcMain: IpcMain,
  shellRepository: IShellRepository
): void {
  const keys: Array<keyof IBridge> = [
    'test',
    'info',
    'error',
    'openGithubForTokenSetup',
  ];

  const loadedHandlers = handlers(shellRepository);

  keys.forEach((key) => {
    ipcMain.on(key, loadedHandlers[key]);
  });
}

type Handler<N extends keyof IBridge> = (
  _: IpcMainEvent,
  args: Parameters<IBridge[N]>
) => void;

interface Handlers {
  test: Handler<'test'>;
  info: Handler<'info'>;
  error: Handler<'error'>;
  openGithubForTokenSetup: Handler<'openGithubForTokenSetup'>;
}

function handlers(shellRepository: IShellRepository): Handlers {
  return {
    openGithubForTokenSetup(): void {
      const url = new URL('https://github.com/settings/tokens/new');
      url.search = new URLSearchParams({
        description: 'Pancake PR dashboard',
        scopes: 'repo,read:org',
      }).toString();

      logger.info(`opening external url ${url.href}`);
      shellRepository
        .openExternal(url.href)
        .catch(logger.errorWithContext('shell open github'));
    },
    test: (_, msg) => {
      logger.info('IPC', ...msg);
    },
    info: (_, msg) => {
      logger.info('IPC', ...msg);
    },
    error: (_, msg) => {
      logger.error('IPC', ...msg);
    },
  };
}
