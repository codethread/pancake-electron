import React, { FC } from 'react';
import { useStore } from '../hooks';
import { NewUser } from './NewUser';
import { PrDashboard } from './PrDashboard';

export const Routes: FC = () => {
  const { store } = useStore();

  if (store.loggedIn) {
    return <PrDashboard />;
  }

  return <NewUser />;
};
