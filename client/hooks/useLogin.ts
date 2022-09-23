import { LoginActorRef, LoginSend } from '@client/machines';
import { useActor } from '@xstate/react';
import { useActorService } from './useMachines';
type UseLogin =
	| {
			send: LoginSend;
			loading: true;
			data: null;
	  }
	| {
			send: LoginSend;
			loading: false;
			data: {
				loggedIn: boolean;
				token?: string;
				rememberMe: boolean;
			};
	  };

export const useLogin = (): UseLogin => {
	const loginMachine = useActorService<LoginActorRef>('LOGIN');
	const [state, send] = useActor(loginMachine);

	if (state.hasTag('loading'))
		return {
			data: null,
			loading: true,
			send,
		};

	return {
		loading: false,
		send,
		data: {
			...state.context,
			loggedIn: state.matches('loggedIn'),
		},
	};
};
