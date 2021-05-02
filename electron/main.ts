// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow, ipcMain } from 'electron';
import {
  logger,
  checkForUpdates,
  setUpDevtools,
  setupIpcHandlers,
} from './services';
import { createWindow } from './windows/main/createWindow';
import { shellRepository } from './repositories/ShellRepository';

let mainWindow: BrowserWindow | null;

checkForUpdates(logger);

app
  .on('ready', () => {
    mainWindow = createWindow(logger);

    mainWindow.on('closed', closeWindow);
  })
  .whenReady()
  .then(() => setupIpcHandlers(ipcMain, shellRepository))
  .then(setUpDevtools(logger))
  .catch(logger.errorWithContext('main window creation'));

app.allowRendererProcessReuse = false;

function closeWindow(): void {
  mainWindow = null;
  logger.info('User closed window');
  app.quit();
}
