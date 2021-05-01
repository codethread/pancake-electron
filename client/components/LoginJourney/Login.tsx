import React, { FC } from 'react';
import TestIds from '@shared/testids';
import { isDev } from '@shared/constants';
import Greetings from '@client/components/Greetings';
import {
  loginMachine,
  useMachine,
  LoginOptions,
  LoginMatches,
} from '@client/machines';

interface ILoginJourney {
  machineOptions: LoginOptions;
}
const launchableStates: LoginMatches[] = [
  'loggedOut.validateToken.hasConfig',
  'loggedOut.validateToken.noConfig',
];

export const LoginJourney: FC<ILoginJourney> = ({ machineOptions }) => {
  const [state, send] = useMachine(loginMachine, {
    ...machineOptions,
    devTools: isDev,
  });

  return (
    <div data-testid={TestIds.LOGIN_JOURNEY}>
      <Greetings />
      {state.matches('loggedIn') && (
        <>
          <button type="button" onClick={() => send({ type: 'LOGOUT' })}>
            log out
          </button>
          <div>dashboard</div>
        </>
      )}
      {state.matches('loggedOut') && (
        <>
          <button
            type="button"
            onClick={() => send({ type: 'VALIDATE', token: 'hello' })}
          >
            log in
          </button>
          <button type="button" onClick={() => send({ type: 'TOGGLE_HELP' })}>
            toggle help
          </button>
        </>
      )}
      {state.matches('loggedOut.createToken.help') && <div>Help Section</div>}
      {state.matches('loggedOut.validateToken.invalidToken') && (
        <>
          <div>invalid token</div>
          <button type="button" onClick={() => send({ type: 'BACK' })}>
            back
          </button>
        </>
      )}
      {launchableStates.some(state.matches) && (
        <>
          <div>hello {state.context.user?.name}</div>
          <button type="button" onClick={() => send({ type: 'LAUNCH' })}>
            launch
          </button>
        </>
      )}
      {state.matches('loggedOut.validateToken.profileFailure') && (
        <>
          <div>no user</div>
          <button type="button" onClick={() => send({ type: 'TRY_AGAIN' })}>
            try again
          </button>
          <button type="button" onClick={() => send({ type: 'BACK' })}>
            back
          </button>
        </>
      )}
    </div>
  );
};
