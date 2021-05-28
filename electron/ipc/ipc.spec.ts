import { mocked } from 'ts-jest/utils';
import { logger as _logger } from '@electron/services/logger';
import { createFakeBridge } from './handlers/createFakeBridge';

jest.mock('@electron/services/logger');
jest.mock('electron');

const logger = mocked(_logger, true);

describe('setupIpcHandlers', () => {
  it('should setup the test handler for the test event', () => {
    const bridge = createFakeBridge();
    bridge.test('here is a message', 'in two parts');
    expect(logger.info).toHaveBeenCalledWith('IPC', 'here is a message', 'in two parts');
  });

  it('should setup the info handler for the info event', () => {
    const bridge = createFakeBridge();
    bridge.info('here is a message', 'in two parts');
    expect(logger.info).toHaveBeenCalledWith('IPC', 'here is a message', 'in two parts');
  });

  it('should setup the error handler for the error event', () => {
    const bridge = createFakeBridge();
    bridge.error('error!', 'bang!');
    expect(logger.error).toHaveBeenCalledWith('IPC', 'error!', 'bang!');
  });
});
