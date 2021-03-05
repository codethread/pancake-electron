import _log from 'electron-log';
import { mocked } from 'ts-jest/utils';
import { createLogger, ILogger, loggerErrorHandler } from './createLogger';

jest.mock('electron-log');
const log = mocked(_log, true);

describe('createLogger', () => {
  const error = new Error('poop');
  let logger: ILogger;

  beforeEach(() => {
    logger = createLogger(_log);
  });

  it('sets transport correctly', () => {
    expect(log.transports.file.level).toBe('info');
    expect(log.transports.console.level).toBe('silly');
  });

  it('errorWithContext logs errors', () => {
    logger.errorWithContext('context')(error);
    expect(log.error).toHaveBeenCalledWith('context', error);
  });

  it('sets up uncaught error handler', () => {
    expect(log.catchErrors).toHaveBeenCalledWith({
      showDialog: false,
      onError: loggerErrorHandler,
    });
  });

  it('logs the initialised state', () => {
    expect(log.info).toHaveBeenCalledWith(
      expect.any(String),
      /* eslint-disable @typescript-eslint/no-unsafe-assignment */
      expect.objectContaining({
        integration: false,
        env: 'test',
        file: expect.any(String),
        console: expect.any(String),
      })
      /* eslint-enable @typescript-eslint/no-unsafe-assignment */
    );
  });
});
