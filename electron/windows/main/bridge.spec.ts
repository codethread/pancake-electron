import { ipcRenderer } from 'electron';
import { IBridge } from '@shared/types';
import { bridgeCreator } from './bridge';

describe('bridgeCreator', () => {
  const str = 'string';

  interface Test {
    args: string[];
    method: keyof IBridge;
  }
  test.each`
    method                       | args
    ${'test'}                    | ${[str, str]}
    ${'info'}                    | ${[str, str]}
    ${'error'}                   | ${[str, str]}
    ${'openGithubForTokenSetup'} | ${[]}
  `(
    'bridge.$method sends args as an array to bridge',
    ({ method, args }: Test) => {
      const bridge = bridgeCreator(ipcRenderer);
      bridge[method](...args);
      expect(ipcRenderer.send).toHaveBeenCalledWith(method, args);
    }
  );
});
