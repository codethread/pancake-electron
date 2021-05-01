/* eslint-disable class-methods-use-this,@typescript-eslint/no-explicit-any */
// eslint-disable-next-line import/no-extraneous-dependencies
import { IpcMain } from 'electron';
import { EventEmitter } from 'events';

export class MockIpcMain extends EventEmitter implements IpcMain {
  public handle(
    channel: string,
    listener: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => any
  ): void {
    this.noop(channel, listener);
  }

  public handleOnce(
    channel: string,
    listener: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => any
  ): void {
    this.noop(channel, listener);
  }

  public removeHandler(channel: string): void {
    this.noop(channel);
  }

  private noop(
    channel: string,
    listener?: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => any
  ): void {
    // eslint-disable-next-line no-console
    console.log(channel, listener);
    throw new Error('method not yet mocked');
  }
}
