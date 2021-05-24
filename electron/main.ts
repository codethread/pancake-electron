// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow, ipcMain } from 'electron';
import { fakeRepositories, productionRepositories } from '@electron/repositories';
import { isIntegration } from '@shared/constants';
import { logger, checkForUpdates, setUpDevtools, setupIpcHandlers } from './services';
import { createWindow } from './windows/main/createWindow';

let mainWindow: BrowserWindow | null;

checkForUpdates(logger);

const repos = isIntegration ? fakeRepositories() : productionRepositories;

app
  .on('ready', () => {
    mainWindow = createWindow(logger);

    mainWindow.on('closed', closeWindow);
  })
  .whenReady()
  .then(() => setupIpcHandlers(ipcMain, repos))
  .then(setUpDevtools(logger))
  .catch(logger.errorWithContext('main window creation'));

app.allowRendererProcessReuse = false;

function closeWindow(): void {
  mainWindow = null;
  logger.info('User closed window');
  app.quit();
}
