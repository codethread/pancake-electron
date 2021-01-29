import type { ILogger } from './logger';
import { autoUpdater } from 'electron-updater';

export class AppUpdater {
  constructor(private logger: ILogger) {
    autoUpdater.logger = logger;
  }

  init(): void {
    autoUpdater
      .checkForUpdatesAndNotify()
      .catch(this.logger.errorWithContext('checking for updates'));
  }
}
