import { shell } from 'electron';
import React, { FC, useContext, useState } from 'react';
import { Button } from '../';
import { StoreContext } from '../../contexts';
import githubScopes from './github-scopes.png';

export const SignInForm: FC = () => {
  const {
    fetch: { login },
  } = useContext(StoreContext);
  const [token, setToken] = useState('');

  return (
    <div>
      <p>Looks like you aren&apos;t logged in</p>
      <p>
        Please click the link below to be taken to Github to create a new access
        token.
      </p>
      <p>
        You&apos;ll need to give this token the following scopes:{' '}
        <code>repo</code>, <code>org:read</code>
      </p>
      <img src={githubScopes} alt="image of github scopes" />
      <Button
        onClick={() => {
          shell
            .openExternal('https://github.com/settings/tokens/new')
            .catch(console.error);
        }}
      >
        Sign In
      </Button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const trimmed = token.trim();
          login(trimmed).catch(console.error);
        }}
      >
        <label htmlFor="token">Paste your token here:</label>
        <input
          type="password"
          id="token"
          name="token"
          onChange={(e) => {
            setToken(e.target.value);
          }}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
