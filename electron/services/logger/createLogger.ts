import { ElectronLog, LevelOption } from 'electron-log';
import { isIntegration, nodenv } from '@shared/constants';
import type { Nodenv } from '@shared/asserts';
import { errorHandler } from './errorHandler';

// eslint-disable-next-line import/no-mutable-exports
export let loggerErrorHandler: ReturnType<typeof errorHandler>;

export interface ILogger extends ElectronLog {
  errorWithContext(context: string): (err: Error) => void;
  info(...msg: string[]): void;
}

type LogLevels = [Nodenv, LevelOption][];

const fileLogLevels: LogLevels = [
  ['development', false],
  ['test', false],
  ['production', 'info'],
];

const consoleLogLevels: LogLevels = [
  ['development', 'silly'],
  ['test', 'silly'],
  ['production', false],
];

export function createLogger(log: ElectronLog): ILogger {
  // eslint-disable-next-line no-param-reassign
  log.transports.file.level = getLevel(fileLogLevels);
  // eslint-disable-next-line no-param-reassign
  log.transports.console.level = isIntegration
    ? 'info'
    : getLevel(consoleLogLevels);

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

  logger.info(
    'Logger initialised',
    JSON.stringify({
      env: nodenv,
      integration: isIntegration,
      file: log.transports.file.level,
      console: log.transports.console.level,
    })
  );

  return logger;
}

function getLevel(levels: LogLevels): LevelOption {
  return levels.find(([setting]) => setting === nodenv)?.[1] ?? 'info';
}
