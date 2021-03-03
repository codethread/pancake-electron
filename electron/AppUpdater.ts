import log from 'electron-log';
import { autoUpdater } from 'electron-updater';

export function checkForUpdates(): void {
  log.transports.file.level = 'debug';
  autoUpdater.logger = log;
  autoUpdater.checkForUpdatesAndNotify().catch((err) => log.error(err));
}
