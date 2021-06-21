import { IpcRenderer, ipcRenderer } from 'electron';
import { IBridge } from '@shared/types';
import { bridgeCreator } from './bridge';

describe('bridgeCreator', () => {
  const str = 'string';

  interface Test {
    args: any[];
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
    ${'updateUserConfig'}            | ${[str]}      | ${'invoke'}
    ${'resetUserConfig'}             | ${[]}         | ${'invoke'}
  `(
    'bridge.$method sends args as an array to bridge method "$ipc"',
    async ({ method, args, ipc }: Test) => {
      const bridge = bridgeCreator(ipcRenderer);
      // @ts-expect-error I'm not sure how to type the args here, but the the test validates each method passes an array of arguments straight through to the ipc layer.
      await bridge[method](...args);
      expect(ipcRenderer[ipc]).toHaveBeenCalledWith(method, args);
    }
  );
});
