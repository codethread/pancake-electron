import { BrowserWindow } from '@electron/electron';
import { ILogger } from '@shared/types/logger';
import path from 'path';
import url from 'url';
import { isDev, isProd } from '@shared/constants';
import { not } from '@shared/utils';

export function createMain(logger: ILogger): BrowserWindow {
	const mainWindow = new BrowserWindow({
		width: 1100,
		height: 700,
		backgroundColor: '#191622',
		webPreferences: {
			contextIsolation: true,
			plugins: not(isProd),
			preload: path.join(__dirname, './preload.js'),
		},
	});

	if (isDev) {
		mainWindow.webContents.openDevTools();

		mainWindow
			.loadURL('http://localhost:4000')
			.catch(logger.errorWithContext('loading window from dev server'));
	} else {
		mainWindow
			.loadURL(
				url.format({
					pathname: path.join(__dirname, 'renderer/index.html'),
					protocol: 'file:',
					slashes: true,
				})
			)
			.catch(logger.errorWithContext('loading window from file'));
	}

	mainWindow.webContents.on('did-finish-load', () => {
		mainWindow.setTitle('Pancake');
	});

	return mainWindow;
}
