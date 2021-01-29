import { app } from 'electron';

import { AppUpdater } from './updater';
import { logger } from './logger';
import { createWindow } from './createWindow';
import { setUpDevtools } from './devTools';

let mainWindow: Electron.BrowserWindow | null;

new AppUpdater(logger).init();

app
  .on('ready', () => createWindow(mainWindow, logger))
  .whenReady()
  .then(setUpDevtools(logger))
  .catch(logger.errorWithContext('main window creation'));

app.on('window-all-closed', () => {
  app.quit();
});

app.allowRendererProcessReuse = true;
