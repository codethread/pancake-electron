// import { shell } from 'electron';
import React, { FC, useState } from 'react';
import { Button } from '../';
import { useStore } from '../../hooks';
import githubScopes from '../../../designAssets/github-scopes-dark.png';
import styled from 'styled-components';
import { Box, H2, H3, Img, P, Input } from '../Atoms';

// const Glass = styled.div`
//   box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6),
//     0 22px 70px 4px rgba(0, 0, 0, 0.56), 0 0 0 1px rgba(0, 0, 0, 0);
//   width: 300px;
//   height: 300px;
//   border-radius: 5px;
//   margin: auto;
//   background: rgba(255, 255, 255, 0.8);
// `;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  align-content: stretch;
  justify-content: space-around;

  @media (min-width: ${(props) => props.theme.breakpoints.sm}px) {
    flex-direction: row;
  }
`;

export const SignInForm: FC = () => {
  const {
    fetch: { login },
  } = useStore();
  const [token, setToken] = useState('');

  return (
    <Container>
      <Box>
        <H2>Welcome to Pancake</H2>
        <H3>The Github Pull Request Dashboard</H3>
        <P>
          Looks like you aren&apos;t logged in
          <br />
          Click the button below to create an access token with Github
        </P>
        <Button
          onClick={() => {
            // shell
            //   .openExternal('https://github.com/settings/tokens/new')
            //   .catch(console.error);
          }}
        >
          Sign In
        </Button>
        <P>
          You&apos;ll need to give this token the following scopes:{' '}
          <code>repo</code>, <code>org:read</code>
        </P>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const trimmed = token.trim();
            login(trimmed).catch(console.error);
          }}
        >
          <Input
            onChange={(e) => {
              setToken(e.target.value);
            }}
          >
            Paste your token here
          </Input>
          <Button>Save Token</Button>
        </form>
      </Box>
      <Box>
        <Img src={githubScopes} alt="image of github scopes" />
      </Box>
    </Container>
  );
};
