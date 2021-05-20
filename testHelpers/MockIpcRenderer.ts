/* eslint-disable class-methods-use-this,@typescript-eslint/no-explicit-any */
import { IpcRenderer } from 'electron';
import { EventEmitter } from 'events';
import { MockIpcMain } from '@test/MockIpcMain';

export class MockIpcRenderer extends EventEmitter implements IpcRenderer {
  constructor(private readonly mockIpcMain: MockIpcMain) {
    super();
  }

  public send(channel: string, ...args: any[]): void {
    // a little massaging to use the builtin eventEmitter to send the message to our mock
    const ipcMainEvent = null;
    this.mockIpcMain.emit(channel, ipcMainEvent, ...args);
  }

  public async invoke(_: string, ...___: any[]): Promise<any> {
    return Promise.reject(new Error('method not yet mocked'));
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public postMessage(_: string, __: any, ___?: MessagePort[]): void {
    throw new Error('method not yet mocked');
  }

  public sendSync(_: string, ...__: any[]): any {
    throw new Error('method not yet mocked');
  }

  public sendTo(_: number, __: string, ...___: any[]): void {
    throw new Error('method not yet mocked');
  }

  public sendToHost(_: string, ...__: any[]): void {
    throw new Error('method not yet mocked');
  }
}
