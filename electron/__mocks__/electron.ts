export const app = {
  getName: jest.fn(),
  getVersion: jest.fn(),
  quit: jest.fn(),
};

export const dialog = {
  showMessageBox: jest.fn().mockResolvedValue(null),
};

export const ipcMain = {
  on: jest.fn(),
};

export const ipcRenderer = {
  send: jest.fn(),
  // mock with a simple result returned
  invoke: jest.fn().mockResolvedValue({ ok: true, val: 'some value' }),
};

export const contextBridge = {
  exposeInMainWorld: jest.fn(),
};

export const shell = {
  openExternal: jest.fn().mockResolvedValue(undefined),
};
