import { IEApi } from '@shared/eApi';

declare global {
  interface Window {
    eApi: IEApi;
  }
}
