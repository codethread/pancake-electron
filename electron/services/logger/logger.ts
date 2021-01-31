import log, { ElectronLog } from 'electron-log';
import { errorHandler } from './errorHandler';

export interface ILogger extends ElectronLog {
  errorWithContext(context: string): (err: Error) => void;
}

export const logger = _createLogger(log);

export let _errorHandler: ReturnType<typeof errorHandler>;

export function _createLogger(log: ElectronLog): ILogger {
  log.transports.file.level = 'info';
  log.transports.console.level = 'silly';

  const logger: ILogger = {
    ...log,
    errorWithContext(context: string) {
      return (err: Error) => {
        log.error(context, err);
      };
    },
  };

  _errorHandler = errorHandler(logger);

  log.catchErrors({
    showDialog: false,
    onError: _errorHandler,
  });

  return logger;
}
