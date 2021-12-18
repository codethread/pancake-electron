import React, { FC } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { Inspector } from '@client/components';
import { loginMachine, loginOptions, useMachine } from '@client/machines';
import { IBridge } from '@shared/types';
import { err, ok } from '@shared/Result';
import { exampleUser } from '@test/fixtures/github';

export default {
  title: 'Machines/Login',
} as Meta;

const bridge: IBridge = {
  loadUserConfig: async () => Promise.resolve(err('no store')),
  error(): void {},
  info(): void {},
  openGithubForTokenSetup(): void {},
  validateAndStoreGithubToken: async () => Promise.resolve(ok(true)),
  test(): void {},
  getCurrentUser: async () => Promise.resolve(ok(exampleUser)),
};

const LoginMachine: FC = () => {
  useMachine(loginMachine, {
    ...loginOptions(bridge),
    /* eslint-disable */
    // turning these off allows clicking through the state machine in storybook
    services: {} as any,
    // actions: {} as any,
    /* eslint-enable */
    devTools: true,
  });

  return null;
};

export const Login: Story = () => (
  <>
    <Inspector />
    <LoginMachine />
  </>
);
