// preload.js
import { contextBridge, shell } from 'electron';
import { IEApi } from '@shared/eApi';

const eApi: IEApi = {
  openGithub: () => {
    shell
      .openExternal('https://github.com/settings/tokens/new')
      .catch(console.error);
  },
};
contextBridge.exposeInMainWorld('eApi', eApi);
