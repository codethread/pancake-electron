// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';
import { IBridge } from '@shared/types';

export const bridge: IBridge = {
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
