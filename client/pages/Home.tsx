import React, { FC } from 'react';
import { Navigation } from '@client/components';
import { loginOptions } from '@client/machines';
import { Scaffold } from '@client/components/Scaffold/Scaffold';
import { IBridge } from '@shared/types';
import { LoginJourney } from './home/LoginJourney';

interface IHome {
  bridge: IBridge;
}

export const Home: FC<IHome> = ({ bridge }) => (
  <Scaffold bridge={bridge}>
    <Navigation />
    <LoginJourney machineOptions={loginOptions(bridge)} />
  </Scaffold>
);
