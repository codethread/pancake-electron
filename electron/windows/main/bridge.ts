// eslint-disable-next-line import/no-extraneous-dependencies
import { IpcRenderer } from 'electron';
import { IBridge } from '@shared/types';

export function bridgeCreator(ipcRenderer: IpcRenderer): IBridge {
  return {
    test: (...args) => {
      ipcRenderer.send('test', args);
    },
    info(...msg) {
      ipcRenderer.send('info', msg);
    },
    error(...params) {
      ipcRenderer.send('error', params);
    },
  };
}
