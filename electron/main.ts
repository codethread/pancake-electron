import { app, BrowserWindow, ipcMain, session } from '@electron/electron';
import { isIntegration } from '@shared/constants';
import { fakeRepositories, productionRepositories } from './repositories';
import { logger, checkForUpdates, setUpDevtools } from './services';
import { setupIpcHandlers, handlers } from './ipc';
import { createWindow } from './windows/main/createWindow';

let mainWindow: BrowserWindow | null;

checkForUpdates(logger);

const repos = isIntegration ? fakeRepositories() : productionRepositories();

app
  .on('ready', () => {
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          // 'Content-Security-Policy': ["default-src 'self' 'unsafe-inline' devtools: 'unsafe-eval'"],
        },
      });
    });

    mainWindow = createWindow(logger);

    mainWindow.on('closed', closeWindow);
  })
  .whenReady()
  .then(() => setupIpcHandlers(ipcMain, handlers(repos)))
  .then(setUpDevtools(logger))
  .catch(logger.errorWithContext('main window creation'));

app.allowRendererProcessReuse = false;

function closeWindow(): void {
  mainWindow = null;
  logger.info('User closed window');
  app.quit();
}
