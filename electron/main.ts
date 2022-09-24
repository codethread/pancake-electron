import { app, BrowserWindow, ipcMain } from '@electron/electron';
import { handlers, setupIpcHandlers } from '@electron/ipc';
import { createRepos } from '@electron/repositories';
import { checkForUpdates, createLogger, setUpDevtools } from '@electron/services';

import log from 'electron-log';
import { errorHandler } from './services/logger/errorHandler';
import { createMain } from './windows/createMain';

let mainWindow: BrowserWindow | null;
const logger = createLogger(log);

checkForUpdates(logger);

app
	.on('ready', () => {
		logger.info('app ready');
		mainWindow = createMain(logger);
		mainWindow.on('closed', closeWindow);
	})
	.whenReady()
	.then(async () => createRepos({ logger }))
	.then((repos) => setupIpcHandlers(ipcMain, handlers(repos)))
	.then(() => setUpDevtools(logger))
	.catch(logger.errorWithContext('main window creation'));

function closeWindow(): void {
	mainWindow = null;
	logger.info('User closed window');
	app.quit();
}
