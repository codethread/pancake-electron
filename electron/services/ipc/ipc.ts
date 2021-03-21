// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcMain, IpcMainEvent } from 'electron';
import { logger } from '../logger';

export function setupIpcHandlers(): void {
  ipcMain.on('bridge', bridge);
}

export function bridge(_: IpcMainEvent, msg: string): void {
  logger.info('ipc message', msg);
}

// ipcMain.on('unexpectedError', (_, err) => {
//   if (err instanceof Error) {
//     const { message, stack } = err;
//     logger.error('unexpectedError', { message, stack });
//   } else {
//     logger.error('unexpectedError', JSON.stringify(err));
//   }
// });

// shell.openExternal('https://github.com/settings/tokens/new').catch((e) => {
//   ipcRenderer.send('unexpectedError', e);
// });
