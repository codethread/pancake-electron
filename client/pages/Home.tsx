import React, { FC } from 'react';
import { Inspector, LoginJourney, Navigation } from '@client/components';
import { loginOptions } from '@client/machines';
import { GlobalStyle } from '../styles/GlobalStyle';

export const Home: FC = () => (
  <>
    <Inspector />
    <GlobalStyle />
    <Navigation />
    <LoginJourney machineOptions={loginOptions} />
  </>
);
