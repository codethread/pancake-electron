import { logger, _createLogger, _errorHandler } from './logger';
import _log from 'electron-log';
import { mocked } from 'ts-jest/utils';

jest.mock('electron-log');
const log = mocked(_log, true);

describe('logger', () => {
  const error = new Error('poop');

  it('sets transport correctly', () => {
    expect(logger).toBeDefined();
    expect(log.transports.file?.level).toBe('debug');
  });

  it('errorWithContext logs errors', () => {
    logger.errorWithContext('context')(error);
    expect(log.error).toHaveBeenCalledWith('context', error);
  });

  it('sets up uncaught error handler', () => {
    _createLogger(_log);
    expect(log.catchErrors).toHaveBeenCalledWith({
      showDialog: false,
      onError: _errorHandler,
    });
  });
});
