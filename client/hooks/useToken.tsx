import { IChildren } from '@shared/types/ipc';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useConfig } from './useConfig';

type IToken = { token?: string; setToken(token: string): void };
const tokenContext = createContext<IToken | null>(null);

const { Provider } = tokenContext;

export const useToken = (): IToken => {
	const context = useContext(tokenContext);
	if (!context) {
		throw new Error('useToken used without Provider');
	}
	return context;
};

export function TokenProvider({ children }: IChildren): JSX.Element {
	const { config } = useConfig();
	const [token, setTokenValue] = useState<string>();

	// store the token and add it to session storage for apollo
	const setToken = useCallback(
		(t: string) => {
			setTokenValue(t);
			sessionStorage.setItem('token', t);
		},
		[setTokenValue]
	);

	useEffect(() => {
		// if a token is read from storage (likely on initial load, set it as our value)
		if (config?.token && config.token !== token) {
			setToken(config.token);
		}
	}, [config, token, setToken]);

	return <Provider value={{ token, setToken }}>{children}</Provider>;
}
