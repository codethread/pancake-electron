import { fakeRepositories, RepositoryOverrides } from '@electron/repositories';
import { IBridge } from '@shared/types';
import { FakeIpcMain } from '@test/FakeIpcMain';
import { FakeIpcRenderer } from '@test/FakeIpcRenderer';
import { bridgeCreator } from '@electron/windows/main/bridge';
import { setupIpcHandlers } from '../ipc';

// I have intimately coupled the ipcMain events to the ipcRenderer events
// I think this is valid, despite that making this an integration test
export function createFakeBridge(overrides?: RepositoryOverrides): IBridge {
  const repos = fakeRepositories(overrides);

  const mockIpcMain = new FakeIpcMain();
  const mockIpcRenderer = new FakeIpcRenderer(mockIpcMain);

  const bridge = bridgeCreator(mockIpcRenderer);
  setupIpcHandlers(mockIpcMain, repos);
  return bridge;
}
