import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { app } from 'electron';

import { checkForUpdates, logger, setUpDevtools } from './services';
import { createWindow } from './createWindow';
import { createClientStore } from './stores/clientStore';
import { createServerStore } from './stores/serverStore';
import { createSharedStore } from './stores/sharedStore';

let mainWindow: Electron.BrowserWindow | null;

checkForUpdates(logger);

createClientStore(logger);
createSharedStore(logger, createServerStore(logger));

app
  .on('ready', () => createWindow(mainWindow, logger))
  .whenReady()
  .then(setUpDevtools(logger))
  .catch(logger.errorWithContext('main window creation'));

app.on('window-all-closed', () => {
  app.quit();
});

app.allowRendererProcessReuse = true;
