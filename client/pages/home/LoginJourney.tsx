import React, { FC } from 'react';
import TestIds from '@shared/testids';
import { isDev } from '@shared/constants';
import { loginMachine, LoginMatches, LoginOptions, useMachine } from '@client/machines';
import { Glass } from '@client/components';
import { LoginPage } from '@client/pages/home/LoginPage';
import { Login } from './Login';

const launchableStates: LoginMatches[] = [
  'loggedOut.validateToken.hasConfig',
  'loggedOut.validateToken.noConfig',
];

interface ILoginJourney {
  machineOptions: LoginOptions;
}

export const LoginJourney: FC<ILoginJourney> = ({ machineOptions }) => {
  const [state, send] = useMachine(loginMachine, {
    ...machineOptions,
    devTools: isDev,
  });

  return (
    <div data-testid={TestIds.LOGIN_JOURNEY}>
      <LoginPage>
        {state.matches('loggedIn') && (
          <>
            <button type="button" onClick={() => send({ type: 'LOGOUT' })}>
              log out
            </button>
            <div>dashboard</div>
          </>
        )}
        {state.matches('loggedOut.inputToken') && <Login send={send} state={state} />}
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
              Launch my dashboard
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

        {state.matches('loggedOut.inputToken.help.show') && (
          <Glass>
            <div>Help Section</div>
          </Glass>
        )}
      </LoginPage>
    </div>
  );
};
