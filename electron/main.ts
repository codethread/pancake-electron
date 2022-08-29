import { app, BrowserWindow, ipcMain } from '@electron/electron';
import { handlers, setupIpcHandlers } from '@electron/ipc';
import { createRepos } from '@electron/repositories';
import { checkForUpdates, createLogger, setUpDevtools } from '@electron/services';

import log from 'electron-log';
import { createMain } from './windows/createMain';

let mainWindow: BrowserWindow | null;
const logger = createLogger(log);

checkForUpdates(logger);

process.stdout.write('hey');

app
	.on('ready', () => {
		logger.info('app ready');
		mainWindow = createMain(logger);

		mainWindow.on('closed', closeWindow);

		// const filter = {
		//   urls: ['http://example.com/*'] // Remote API URS for which you are getting CORS error
		// }
		// mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
		//   filter,
		//   (details, callback) => {
		//      details.requestHeaders.Origin = `http://example.com/*`
		//     callback({ requestHeaders: details.requestHeaders })
		//   }
		// )
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

// globalShortcut.register('Ctrl+Alt+P', () => {
//   // more https://stackoverflow.com/questions/50642126/previous-window-focus-electron if windows and linux don't play ball
//   if (mb.window?.isVisible()) {
//     mb.hideWindow();
//     mb.app.hide();
//   } else {
//     mb.showWindow();
//   }
// });
// });

// mb.on('will-quit', () => {
// globalShortcut.unregisterAll();
// });
