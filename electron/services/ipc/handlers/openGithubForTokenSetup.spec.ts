import { logger } from '@electron/services';
import { createFakeBridge } from './createFakeBridge';

jest.mock('@electron/services/logger');

describe('openGithubForTokenSetup', () => {
  const href = 'https://github.com/settings/tokens/new';
  const logMessage = `opening external url ${href}`;

  it('should open an external webpage when the event is triggered', () => {
    const spy = jest.fn().mockResolvedValue(undefined);

    const bridge = createFakeBridge({
      shellRepository: {
        openExternal: spy,
      },
    });

    bridge.openGithubForTokenSetup();

    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(logMessage));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining(href));
    expect(spy).toHaveBeenCalledWith(expect.stringMatching(/repo.+read.+org/));
  });

  it('should log the error if the open fails', (done) => {
    const bridge = createFakeBridge({
      shellRepository: {
        openExternal: jest.fn().mockRejectedValue(new Error('poop')),
      },
    });

    bridge.openGithubForTokenSetup();

    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(logMessage));
    setImmediate(() => {
      expect(logger.error).toHaveBeenCalledWith('shell open github', 'poop');
      done();
    });
  });
});
