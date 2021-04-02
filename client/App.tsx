import React, { FC } from 'react';
import { render } from 'react-dom';
import { isDev } from '@shared/constants';
import { assign } from 'xstate';
import { GlobalStyle } from './styles/GlobalStyle';

import {
  Inspector,
  loginMachine,
  showInspector,
  useMachine,
  assertEventType,
} from './components';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'root');
document.body.appendChild(mainElement);

const App: FC = () => (
  <>
    {showInspector && <Inspector />}
    <GlobalStyle />
    <LoginIn />
  </>
);

const LoginIn: FC = () => {
  const [state, send] = useMachine(loginMachine, {
    services: {
      validateToken: async () => Promise.resolve(),
      loadConfig: async () => Promise.resolve(),
      fetchUser: async () => Promise.resolve({ user: { name: 'bob' } }),
    },
    actions: {
      storeUser: assign({
        user: (_, e) => {
          assertEventType(e, 'done.invoke.fetchUser');
          return e.data.user;
        },
      }),
      clearUser: assign({
        user: (_) => null,
      }),
    },
    guards: {
      isAuth: (context) => Boolean(context.user),
    },
    devTools: isDev,
  });

  const loggedIn = state.matches('loggedIn');
  const canLaunch = state.matches('loggedOut.validateToken');

  return (
    <div>
      {loggedIn && <p>{state.context.user?.name}&apos;s Dashboard!</p>}
      <button
        type="button"
        onClick={() => {
          if (loggedIn) {
            send({ type: 'LOGOUT' });
          } else {
            send({ type: 'VALIDATE', token: 'some token' });
          }
        }}
      >
        {loggedIn ? 'logout' : 'login'}
      </button>
      {canLaunch && (
        <button
          type="button"
          onClick={() => {
            send({ type: 'LAUNCH' });
          }}
        >
          Launch!
        </button>
      )}
    </div>
  );
};

render(<App />, mainElement);
