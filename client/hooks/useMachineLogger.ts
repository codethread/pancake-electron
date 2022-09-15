import { useEffect } from 'react';
import { AnyInterpreter } from 'xstate';
import { useLogger } from './useLogger';

export const useMachineLogger = (service: AnyInterpreter): void => {
	const { debug } = useLogger();

	useEffect(() => {
		service.onEvent((e) => {
			debug({ data: e, msg: 'repo machine' });
		});
	}, [service, debug]);
};
