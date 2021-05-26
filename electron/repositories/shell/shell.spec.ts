import { shell } from 'electron';
import { logger } from '@electron/services';
import { fakeShell } from './fakeShell';
import { shellRepository } from './shell';

jest.mock('@electron/services/logger');
jest.unmock('electron');

describe('shellRepository', () => {
  it('should be electrons shell instance', () => {
    expect(shellRepository).toBe(shell);
  });

  describe('fake shell', () => {
    it('openExternal should log an event for testing', async () => {
      const res = await fakeShell().openExternal('foo');

      expect(res).toBeUndefined();
      expect(logger.info).toHaveBeenCalledWith('STUBBED SHELL open foo');
    });
  });
});
