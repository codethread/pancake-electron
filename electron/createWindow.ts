// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserWindow } from 'electron';
import path from 'path';
import url from 'url';
import { isDev, isIntegration } from '@shared/constants';
import { ILogger } from './services';

export function createWindow(logger: ILogger): BrowserWindow {
  /**
   * These options should be off in production and dev mode
   * They are only required for e2e testing with Spectron
   *
   * enableRemoteModule needs to be true to allow spectron to access information
   * about the running electron process
   *
   * contextIsolation needs to be disabled to give the browserWindow access to
   * require, which in turn is used to access `remote` as needed above
   */
  const secureEnvs = isIntegration
    ? {
        enableRemoteModule: true,
        contextIsolation: false,
      }
    : {
        enableRemoteModule: false,
        contextIsolation: true,
      };

  logger.debug(secureEnvs);

  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    backgroundColor: '#191622',
    webPreferences: {
      ...secureEnvs,
      nodeIntegration: false,
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
