import { app } from 'electron';

import { checkForUpdates, logger, setUpDevtools } from './services';
import { createWindow } from './createWindow';

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
