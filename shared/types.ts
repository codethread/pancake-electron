import { ElectronLog } from 'electron-log';

export interface ILogger extends ElectronLog {
  errorWithContext(context: string): (err: Error) => void;
  info(...msg: string[]): void;
  error(...msg: string[]): void;
}

export type IClientLogger = Pick<ILogger, 'error' | 'info'>;

export interface IBridge extends IClientLogger {
  test(...msg: string[]): void;
}
