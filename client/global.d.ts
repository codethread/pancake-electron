import { IBridge } from '@shared/IBridge';

declare global {
  interface Window {
    bridge: IBridge;
  }
}
