import React, { FC, useState } from 'react';
import { LoginSend, LoginState } from '@client/machines';
import { Glass } from '@client/components';
import { useMachine } from '@client/machines/utils';
import { formMachine, formOptions } from '@client/machines/form/formMachine';
import { isDev } from '@shared/constants';

interface IProps {
  send: LoginSend;
  state: LoginState;
}

export const Login: FC<IProps> = ({ send, state }) => {
  const [formState, formSend] = useMachine(formMachine, {
    ...formOptions({
      actions: {
        submitValidToken: ({ text }) => {
          send({ type: 'VALIDATE', token: text });
        },
      },
    }),
    devTools: isDev,
  });

  const token = formState.context.text;

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
      <form
        onSubmit={(e) => {
          e.preventDefault();

          formSend({ type: 'SUBMIT' });
        }}
      >
        <label>
          Paste your token here
          <input
            type={visibility}
            value={token}
            onChange={({ target: { value } }) => {
              formSend({ type: 'ENTER_INPUT', text: value });
            }}
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
          disabled={formState.matches('invalid')}
          onClick={() => formSend({ type: 'SUBMIT' })}
        >
          Submit Token
        </button>
      </form>
      <button type="button" onClick={() => send({ type: 'TOGGLE_HELP' })}>
        toggle help
      </button>
      {formState.matches('invalid') && (
        <>
          <p>That doesn't look like a valid token!</p>
          {formState.context.errors.map((err, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <p key={idx}>{err}</p>
          ))}
        </>
      )}
    </Glass>
  );
};