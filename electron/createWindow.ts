import * as path from 'path';
import * as url from 'url';
import { BrowserWindow } from 'electron';
import type { ILogger } from './logger';

export function createWindow(
  window: Electron.BrowserWindow | null,
  logger: ILogger
): void {
  window = new BrowserWindow({
    width: 1100,
    height: 700,
    backgroundColor: '#191622',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    window
      .loadURL('http://localhost:4000')
      .catch(logger.errorWithContext('loading dev window'));
  } else {
    window
      .loadURL(
        url.format({
          pathname: path.join(__dirname, 'renderer/index.html'),
          protocol: 'file:',
          slashes: true,
        })
      )
      .catch(logger.errorWithContext('loading production window'));
  }

  window.webContents.on('did-finish-load', () => {
    // eslint-disable-next-line no-unused-expressions
    window?.setTitle('Pancake');
  });

  window.on('closed', () => {
    window = null;
  });
}
