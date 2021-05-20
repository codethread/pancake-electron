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
        {state.matches('loggedIn') && (
          <>
            <button type="button" onClick={() => send({ type: 'LOGOUT' })}>
              log out
            </button>
            <div>dashboard</div>
          </>
        )}
        {state.matches('loggedOut') && <Login send={send} state={state} />}
        {state.matches('loggedOut.inputToken.help.show') && (
          <Glass>
            <div>Help Section</div>
          </Glass>
        )}
      </LoginPage>
    </div>
  );
};
