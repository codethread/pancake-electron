import { ElectronLog } from 'electron-log';

export type ILogger = ElectronLog & {
	info: (...msg: unknown[]) => void;

	errorWithContext(context: string): (err: Error | string) => void;
};

export type IClientLogger = Pick<ILogger, 'error' | 'info' | 'warn'>;
