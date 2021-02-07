import React, { FC, useEffect } from 'react';
import { useStore } from '../../contexts';
import { Button } from '../Button';

export const Header: FC = () => {
  const {
    store,
    fetch: { logout, getUser },
  } = useStore();

  useEffect(() => {
    if (store.loggedIn) getUser().catch(console.error);
  }, [store.loggedIn]);

  return (
    <div>
      <div>Pancake</div>
      <div>Menu</div>
      {store.loggedIn && (
        <div>
          <p>{store.user?.viewer.name}</p>
          <Button
            onClick={() => {
              // reset('ghToken').catch(console.error);
              logout().catch(console.error);
            }}
          >
            Log out
          </Button>
        </div>
      )}
    </div>
  );
};
