// eslint-disable-next-line import/no-extraneous-dependencies
import { IpcRenderer } from 'electron';
import { IBridge } from '@shared/types';
import { Result } from '@shared/Result';

export function bridgeCreator(ipcRenderer: IpcRenderer): IBridge {
  return {
    async validateGithubToken(...token): Promise<Result<boolean>> {
      // TODO could come up with a type guard?
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return ipcRenderer.invoke('validateGithubToken', token);
    },
    openGithubForTokenSetup(): void {
      ipcRenderer.send('openGithubForTokenSetup', []);
    },
    test: (...args) => {
      ipcRenderer.send('test', args);
    },
    info(...msg) {
      ipcRenderer.send('info', msg);
    },
    error(...params) {
      ipcRenderer.send('error', params);
    },
  };
}
