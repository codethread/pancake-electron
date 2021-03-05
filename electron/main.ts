import { app, BrowserWindow, ipcMain } from 'electron';
import { logger, checkForUpdates, setUpDevtools } from './services';
import { createWindow } from './createWindow';

let mainWindow: BrowserWindow | null;

checkForUpdates(logger);

// ipcMain.on('unexpectedError', (_, err) => {
//   if (err instanceof Error) {
//     const { message, stack } = err;
//     logger.error('unexpectedError', { message, stack });
//   } else {
//     logger.error('unexpectedError', JSON.stringify(err));
//   }
// });

ipcMain.on('bridge', (_, msg) => {
  logger.info('bridge message', msg);
});

app
  .on('ready', () => {
    mainWindow = createWindow(logger);

    mainWindow.on('closed', closeWindow);
  })
  .whenReady()
  .then(setUpDevtools(logger))
  .catch(logger.errorWithContext('main window creation'));

app.allowRendererProcessReuse = true;

function closeWindow(): void {
  mainWindow = null;
  logger.info('User closed window');
  app.quit();
}
