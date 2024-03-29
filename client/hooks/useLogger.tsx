import { IClientLogger } from '@shared/types/logger';
import React, { createContext, useContext } from 'react';
import { useBridge } from './useBridge';

const loggerContext = createContext<IClientLogger | null>(null);

const { Provider } = loggerContext;

export const useLogger = (): IClientLogger => {
	const context = useContext(loggerContext);
	if (!context) throw new Error('useLogger must be wrapper in a provider');
	return context;
};

type ILoggerProvider = {
	children: React.ReactNode;
};

export function LoggerProvider({ children }: ILoggerProvider): JSX.Element {
	const bridge = useBridge();
	return (
		<Provider
			value={{
				info: bridge.info,
				error: bridge.error,
				warn: bridge.warn,
				debug: bridge.debug,
			}}
		>
			{children}
		</Provider>
	);
}
