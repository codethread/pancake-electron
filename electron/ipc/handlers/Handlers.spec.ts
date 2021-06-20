import { handlerMethods } from '@electron/ipc/handlers/Handlers';
import { bridgeCreator } from '@electron/windows/main/bridge';
import { FakeIpcRenderer } from '@test/FakeIpcRenderer';
import { FakeIpcMain } from '@test/FakeIpcMain';

describe('handlerMethods', () => {
  it('should wire up every method from bridge', () => {
    const bridge = bridgeCreator(new FakeIpcRenderer(new FakeIpcMain()));
    const bridgeMethods = Object.keys(bridge).sort();
    const handlerMethodsSorted = handlerMethods.map((m) => m.key).sort();

    expect(handlerMethodsSorted).toStrictEqual(bridgeMethods);
  });
});
