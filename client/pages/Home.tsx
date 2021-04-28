import React, { FC } from 'react';
import { LoginJourney, Navigation } from '@client/components';
import { loginOptions } from '@client/machines';
import { Scaffold } from '@client/pages/Scaffold';
import { IBridge } from '@shared/types';

interface IHome {
  bridge: IBridge;
}

export const Home: FC<IHome> = ({ bridge }) => (
  <Scaffold bridge={bridge}>
    <Navigation />
    <LoginJourney machineOptions={loginOptions} />
  </Scaffold>
);
