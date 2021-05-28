import { app, BrowserWindow, ipcMain } from '@electron/electron';
import { isIntegration } from '@shared/constants';
import { fakeRepositories, productionRepositories } from './repositories';
import { logger, checkForUpdates, setUpDevtools } from './services';
import { setupIpcHandlers } from './ipc';
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
