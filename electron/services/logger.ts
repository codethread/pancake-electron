import { app, dialog } from 'electron';
import log, { ElectronLog } from 'electron-log';

log.transports.file.level = 'debug';

export const logger = loggerMixin(log);

export interface ILogger extends ElectronLog {
  errorWithContext(context: string): (err: Error) => void;
}

function loggerMixin(log: ElectronLog): ILogger {
  return {
    ...log,
    errorWithContext(context: string) {
      return (err: Error) => {
        log.error(context, err);
      };
    },
  };
}

log.catchErrors({
  showDialog: false,
  onError(error, versions, submitIssue) {
    dialog
      .showMessageBox({
        title: 'An error occurred',
        message: error.message,
        detail: error.stack,
        type: 'error',
        buttons: ['Ignore', 'Report', 'Exit'],
      })
      .then((result) => {
        if (result.response === 1) {
          submitIssue &&
            submitIssue(
              'https://github.com/AHDesigns/pancake-electron/issues/new',
              {
                title: `Error report${versions ? versions.app : ''}`,
                body: error.stack
                  ? `Error: \n\`\`\`${error.stack}\n\`\`\`${
                      versions ? 'OS: + versions.os' : ''
                    }`
                  : 'No stack trace',
              }
            );
          return;
        }

        if (result.response === 2) {
          app.quit();
        }
      })
      .catch(logger.errorWithContext('error submitting issue'));
  },
});
