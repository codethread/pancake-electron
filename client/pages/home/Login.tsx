import React, { FC, useState } from 'react';
import { LoginMatches, LoginSend, LoginState } from '@client/machines';
import { Glass } from '@client/components';

const launchableStates: LoginMatches[] = [
  'loggedOut.validateToken.hasConfig',
  'loggedOut.validateToken.noConfig',
];

interface IProps {
  send: LoginSend;
  state: LoginState;
}

export const Login: FC<IProps> = ({ send, state }) => {
  const [tokenInput, setTokenInput] = useState('');
  const [visibility, setVisibility] = useState('password');
  return (
    <Glass>
      <button
        type="button"
        disabled={state.matches('loggedOut.inputToken.createToken.pending')}
        onClick={() => send({ type: 'CREATE_TOKEN' })}
      >
        Create token
      </button>
      <label>
        Paste your token here
        <input
          type={visibility}
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
        />
      </label>
      <button
        type="button"
        onClick={() => {
          setVisibility((v) => (v === 'password' ? 'text' : 'password'));
        }}
      >
        toggle token visibility
      </button>
      <button
        type="button"
        disabled={!tokenInput}
        onClick={() => send({ type: 'VALIDATE', token: 'token' })}
      >
        Submit Token
      </button>
      <button type="button" onClick={() => send({ type: 'TOGGLE_HELP' })}>
        toggle help
      </button>
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
    </Glass>
  );
};
