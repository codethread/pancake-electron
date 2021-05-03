import React, { FC } from 'react';
import TestIds from '@shared/testids';
import { isDev } from '@shared/constants';
import Greetings from '@client/components/Greetings';
import { loginMachine, LoginOptions, useMachine } from '@client/machines';
import { Login } from '@client/components/LoginJourney/Login';

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
      <Greetings />
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
        <div>Help Section</div>
      )}
    </div>
  );
};
