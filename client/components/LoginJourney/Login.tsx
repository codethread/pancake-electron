import React, { FC } from 'react';
import TestIds from '@shared/testids';
import Greetings from '@client/components/Greetings';
import { loginMachine, useMachine, LoginOptions } from '@client/machines';
import { isDev } from '@shared/constants';

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
      <button
        type="button"
        onClick={() => send({ type: 'VALIDATE', token: 'hello' })}
      >
        log in
      </button>
      <button type="button" onClick={() => send({ type: 'TOGGLE_HELP' })}>
        toggle help
      </button>
      {state.matches('loggedOut.createToken.help') && <div>Help Section</div>}
      {state.matches('loggedOut.validateToken.invalidToken') && (
        <>
          <div>invalid token</div>
          <button type="button" onClick={() => send({ type: 'BACK' })}>
            back
          </button>
        </>
      )}
      {state.matches('loggedOut.validateToken.hasConfig') && (
        <div>hello {state.context.user?.name}</div>
      )}
      {state.matches('loggedOut.validateToken.profileFailure') && (
        <>
          <div>no user</div>
          <button type="button" onClick={() => send({ type: 'TRY_AGAIN' })}>
            try again
          </button>
          {/* <button type="button" onClick={() => send({ type: 'BACK' })}> */}
          {/*  back */}
          {/* </button> */}
        </>
      )}
    </div>
  );
};
