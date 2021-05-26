import React, { FC } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { Inspector } from '@client/components';
import { loginMachine, loginOptions, useMachine } from '@client/machines';
import { IBridge } from '@shared/types';
import { ok } from '@shared/Result';

export default {
  title: 'Machines/Login',
} as Meta;

const bridge: IBridge = {
  error(): void {},
  info(): void {},
  openGithubForTokenSetup(): void {},
  validateGithubToken: async () => Promise.resolve(ok(true)),
  test(): void {},
};

const LoginMachine: FC = () => {
  useMachine(loginMachine, {
    ...loginOptions(bridge),
    /* eslint-disable */
    // turning these off allows clicking through the state machine in storybook
    services: {} as any,
    actions: {} as any,
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
