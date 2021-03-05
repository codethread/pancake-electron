import { ElectronLog } from 'electron-log';
import { isIntegration, nodenv } from '@shared/constants';
import { errorHandler } from './errorHandler';

// eslint-disable-next-line import/no-mutable-exports
export let loggerErrorHandler: ReturnType<typeof errorHandler>;

export interface ILogger extends ElectronLog {
  errorWithContext(context: string): (err: Error) => void;
}

export function createLogger(log: ElectronLog): ILogger {
  // eslint-disable-next-line no-param-reassign
  log.transports.file.level = 'info';
  // eslint-disable-next-line no-param-reassign
  log.transports.console.level = 'silly';

  const logger: ILogger = {
    ...log,
    errorWithContext(context: string) {
      return (err: Error) => {
        log.error(context, err);
      };
    },
  };

  loggerErrorHandler = errorHandler(logger);

  log.catchErrors({
    showDialog: false,
    onError: loggerErrorHandler,
  });

  logger.info('Logger initialised', {
    env: nodenv,
    integration: isIntegration,
    file: log.transports.file.level,
    console: log.transports.console.level,
  });

  return logger;
}
