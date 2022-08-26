// eslint-disable-next-line import/no-extraneous-dependencies
import url from 'url';
import path from 'path';
import { checkForUpdates, createLogger, setUpDevtools } from '@electron/services';
import { ipcMain, app, BrowserWindow } from '@electron/electron';
import { productionRepositories } from '@electron/repositories';
import { fakeRepositories } from '@electron/repositories/fakes';
import { handlers, setupIpcHandlers } from '@electron/ipc';
import { isDev, isIntegration } from '@shared/constants';

import log from 'electron-log';
import { createWindow } from './windows/createWindow';

let mainWindow: BrowserWindow | null;
const logger = createLogger(log);

checkForUpdates(logger);
const repos = isIntegration ? fakeRepositories() : productionRepositories({ logger });
app
  .on('ready', () => {
    logger.info('app ready');
    mainWindow = createWindow(logger);

    mainWindow.on('closed', closeWindow);
  })
  .whenReady()
  .then(() => setupIpcHandlers(ipcMain, handlers(repos)))
  .then(() => setUpDevtools(logger))
  .catch(logger.errorWithContext('main window creation'));

function closeWindow(): void {
  mainWindow = null;
  logger.info('User closed window');
  app.quit();
}

// globalShortcut.register('Ctrl+Alt+P', () => {
//   // more https://stackoverflow.com/questions/50642126/previous-window-focus-electron if windows and linux don't play ball
//   if (mb.window?.isVisible()) {
//     mb.hideWindow();
//     mb.app.hide();
//   } else {
//     mb.showWindow();
//   }
// });
// });

// mb.on('will-quit', () => {
// globalShortcut.unregisterAll();
// });
