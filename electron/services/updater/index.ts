import { autoUpdater } from 'electron-updater';
import type { ILogger } from '..';

export function checkForUpdates(logger: ILogger): void {
  autoUpdater.logger = logger;
  autoUpdater
    .checkForUpdatesAndNotify()
    .catch(logger.errorWithContext('checking for updates'));
}
