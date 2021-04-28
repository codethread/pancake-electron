import { ipcRenderer } from 'electron';
import { bridge } from './bridge';

describe('bridge', () => {
  const str = 'string';

  interface Test {
    args: any[];
    method: keyof typeof bridge;
  }
  test.each`
    method     | args
    ${'test'}  | ${[str, str]}
    ${'info'}  | ${[str, str]}
    ${'error'} | ${[str, str]}
  `(
    'bridge.$method sends args as an array to bridge',
    ({ method, args }: Test) => {
      bridge[method](...args);
      expect(ipcRenderer.send).toHaveBeenCalledWith(method, args);
    }
  );
});
