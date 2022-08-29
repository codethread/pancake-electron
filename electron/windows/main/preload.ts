import { contextBridge, ipcRenderer } from '@electron/electron';
import { bridgeCreator } from '@electron/ipc/bridgeCreator';

contextBridge.exposeInMainWorld('bridge', bridgeCreator(ipcRenderer));
