import React, { FC } from 'react';
import { Inspector, LoginJourney } from '@client/components';
import { GlobalStyle } from '../styles/GlobalStyle';

export const Home: FC = () => (
  <>
    <Inspector />
    <GlobalStyle />
    <LoginJourney />
  </>
);
