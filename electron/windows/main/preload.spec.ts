import { contextBridge } from 'electron';
import { bridge } from './bridge';
import { exposeMinimalBridgeApiToClient } from './preload';

jest.mock('./bridge', () => ({
  bridge: {
    foo: () => {},
  },
}));

jest.mock('electron');

test('setUpBridge', () => {
  exposeMinimalBridgeApiToClient();
  expect(contextBridge.exposeInMainWorld).toHaveBeenCalledWith(
    'bridge',
    bridge
  );
});
