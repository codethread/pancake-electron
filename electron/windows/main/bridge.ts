// eslint-disable-next-line import/no-extraneous-dependencies
import { IpcRenderer } from 'electron';
import { IBridge } from '@shared/types';
import { reBuild, Result } from '@shared/Result';

export function bridgeCreator(ipcRenderer: IpcRenderer): IBridge {
  return {
    async validateGithubToken(...token): Promise<Result<boolean>> {
      // TODO could come up with a type guard?
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment
      const result = await ipcRenderer.invoke('validateGithubToken', token);
      return reBuild(result);
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
