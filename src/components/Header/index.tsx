import React, { FC, useContext, useEffect } from 'react';
import { StoreContext } from '../../contexts';
import { Button } from '../Button';

export const Header: FC = () => {
  const {
    store,
    fetch: { logout },
  } = useContext(StoreContext);

  useEffect(() => {
    // dispatch(ipcEvents.GET_USER);
  }, [store.loggedIn]);

  return (
    <div>
      <div>Pancake</div>
      <div>Menu</div>
      {store.loggedIn && (
        <div>
          <p>User name...</p>
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
