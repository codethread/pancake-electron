import log from 'electron-log';
import { autoUpdater } from 'electron-updater';

export class AppUpdater {
  constructor() {
    log.transports.file.level = 'debug';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify().catch((err) => log.error(err));
  }
}
