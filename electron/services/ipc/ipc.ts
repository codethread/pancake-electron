// eslint-disable-next-line import/no-extraneous-dependencies
import { IpcMain, IpcMainEvent } from 'electron';
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
}

const handlers: Handlers = {
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
  const keys: Array<keyof IBridge> = ['test', 'info', 'error'];

  keys.forEach((key) => {
    ipcMain.on(key, handlers[key]);
  });
}
