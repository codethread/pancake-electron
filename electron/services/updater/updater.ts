import { ILogger } from '@shared/types';
import { autoUpdater } from 'electron-updater';

export function checkForUpdates(logger: ILogger): void {
  autoUpdater.logger = logger;

  autoUpdater.on('update-not-available', (info) => {
    setTimeout(() => {
      tryUpdate(logger);
    }, 1000 * 60 * 5);
  });

  tryUpdate(logger);
}

function tryUpdate(logger: ILogger): void {
  autoUpdater.checkForUpdatesAndNotify().catch(logger.errorWithContext('checking for updates'));
}
