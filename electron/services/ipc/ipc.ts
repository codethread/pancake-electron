// eslint-disable-next-line import/no-extraneous-dependencies
import { IpcMain, IpcMainEvent, shell } from 'electron';
import { IBridge } from '@shared/types';
import { logger } from '../logger';

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

const handlers: Handlers = {
  openGithubForTokenSetup(): void {
    const url = new URL('https://github.com/settings/tokens/new');
    url.search = new URLSearchParams({
      description: 'Pancake PR dashboard',
      scopes: 'repo,read:org',
    }).toString();

    logger.info(`opening external url ${url.href}`);
    shell
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

export function setupIpcHandlers(ipcMain: IpcMain): void {
  const keys: Array<keyof IBridge> = [
    'test',
    'info',
    'error',
    'openGithubForTokenSetup',
  ];

  keys.forEach((key) => {
    ipcMain.on(key, handlers[key]);
  });
}
