import React, { FC, useContext } from 'react';
import { StoreContext } from '../contexts';
import { NewUser } from './NewUser';
import { PrDashboard } from './PrDashboard';

export const Routes: FC = () => {
  const { store } = useContext(StoreContext);

  if (store.loggedIn) {
    return <PrDashboard />;
  }

  return <NewUser />;
};
