import React, { FC } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { Inspector } from '@client/components';
import { loginMachine, LoginOptions, useMachine } from '@client/machines';
import { isDev } from '@shared/constants';

export default {
  title: 'Machines/Login',
} as Meta;

const loginOptions: LoginOptions = {
  guards: {
    isAuth: () => true,
  },
  /* eslint-disable */
  // turning these off allows clicking through the state machine in storybook
  services: {} as any,
  actions: {} as any,
  /* eslint-enable */
};

const LoginMachine: FC = () => {
  useMachine(loginMachine, {
    ...loginOptions,
    devTools: isDev,
  });

  return null;
};

export const Login: Story = () => (
  <>
    <Inspector />
    <LoginMachine />
  </>
);
