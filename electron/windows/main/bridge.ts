import { IpcRenderer } from '@electron/electron';
import { IBridge } from '@shared/types';
import { reBuild, Result } from '@shared/Result';

export function bridgeCreator(ipcRenderer: IpcRenderer): IBridge {
  return {
    async getCurrentUser() {
      return invoker('getCurrentUser', []);
    },
    async validateAndStoreGithubToken(...token) {
      return invoker('validateAndStoreGithubToken', token);
    },
    openGithubForTokenSetup() {
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
    async loadUserConfig() {
      return invoker('loadUserConfig', []);
    },
    async updateUserConfig(...config) {
      return invoker('updateUserConfig', config);
    },
    async resetUserConfig() {
      return invoker('resetUserConfig', []);
    },
  };

  // bit of ugliness here to save us repeating it above
  // the idea is that all invokes return a Result
  // however a Result can't be passed across processes so we `strip` it in the main process,
  // and then build it back up here.

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function invoker<A = any, B = any>(key: keyof IBridge, args: any[]): Promise<Result<A, B>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const strippedResult = await ipcRenderer.invoke(key, args);
    return reBuild<A, B>(strippedResult);
  }
}
