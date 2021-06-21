import React, { FC } from 'react';
import TestIds from '@shared/testids';
import { isDev } from '@shared/constants';
import { loginMachine, LoginOptions, useMachine } from '@client/machines';
import { Glass } from '@client/components';
import { LoginPage } from '@client/pages/home/LoginPage';
import { Login } from './Login';

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
        {(state.matches('authorize') || state.matches('loggedIn.confirmed')) && <p>loading</p>}

        {state.matches('loggedIn.idle') && (
          <>
            <button type="button" onClick={() => send({ type: 'LOGOUT_ATTEMPT' })}>
              log out
            </button>
            <div>dashboard</div>
          </>
        )}

        {state.matches('loggedIn.confirmation') && (
          <>
            <p>are you sure you want to log out?</p>
            <p>This will clear all your user data</p>
            <button type="button" onClick={() => send({ type: 'LOGOUT_CONFIRM' })}>
              Yes I am sure
            </button>
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

        {state.matches('loggedOut.validateToken.readyToLaunch') && (
          <>
            <div>hello {state.context.user?.viewer.name}</div>
            <button type="button" onClick={() => send({ type: 'LAUNCH' })}>
              Launch my dashboard
            </button>
          </>
        )}
      </LoginPage>
    </div>
  );
};
