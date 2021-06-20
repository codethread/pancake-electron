import { IpcRenderer, ipcRenderer } from 'electron';
import { IBridge } from '@shared/types';
import { bridgeCreator } from './bridge';

describe('bridgeCreator', () => {
  const str = 'string';

  interface Test {
    args: string[];
    method: keyof IBridge;
    ipc: keyof IpcRenderer;
  }
  test.each`
    method                           | args          | ipc
    ${'test'}                        | ${[str, str]} | ${'send'}
    ${'info'}                        | ${[str, str]} | ${'send'}
    ${'error'}                       | ${[str, str]} | ${'send'}
    ${'openGithubForTokenSetup'}     | ${[]}         | ${'send'}
    ${'validateAndStoreGithubToken'} | ${[str]}      | ${'invoke'}
    ${'getCurrentUser'}              | ${[]}         | ${'invoke'}
    ${'loadUserConfig'}              | ${[]}         | ${'invoke'}
  `(
    'bridge.$method sends args as an array to bridge method "$ipc"',
    async ({ method, args, ipc }: Test) => {
      const bridge = bridgeCreator(ipcRenderer);
      await bridge[method](...args);
      expect(ipcRenderer[ipc]).toHaveBeenCalledWith(method, args);
    }
  );
});
