import { app } from 'electron';

import { checkForUpdates } from './services/updater';
import { logger } from './services/logger';
import { createWindow } from './createWindow';
import { setUpDevtools } from './devTools';

let mainWindow: Electron.BrowserWindow | null;

checkForUpdates(logger);

app
  .on('ready', () => createWindow(mainWindow, logger))
  .whenReady()
  .then(setUpDevtools(logger))
  .catch(logger.errorWithContext('main window creation'));

app.on('window-all-closed', () => {
  app.quit();
});

app.allowRendererProcessReuse = true;
