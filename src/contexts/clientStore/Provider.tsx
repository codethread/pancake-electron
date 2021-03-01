import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { SharedConfig, sharedConfig } from '../../../shared/sharedConfig';
import { ipcRenderer } from 'electron';
import { ipcEvents } from '../../../shared/ipcEvents';
import { StoreContext } from './Context';

export const StoreProvider: FC = ({ children }) => {
  const [store, updateStore] = useState(sharedConfig);

  useEffect(() => {
    readStore(updateStore).catch(console.error);
  }, []);

  useEffect(() => {
    ipcRenderer.on(ipcEvents.SS_UPDATE, (_, updatedStore: unknown) => {
      assertConfig(updatedStore);
      updateStore(updatedStore);
    });
  }, []);

  return (
    <StoreContext.Provider
      value={{
        store,
        fetch: {
          login: login(updateStore),
          logout: logout(updateStore),
          getUser: getUser(updateStore),
        },
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

type Update = Dispatch<SetStateAction<SharedConfig>>;

async function readStore(dispatch: Update): Promise<void> {
  const res = (await ipcRenderer.invoke(ipcEvents.SS_READ)) as unknown;
  assertConfig(res);
  dispatch(res);
}

function login(dispatch: Update) {
  return async function (token: string): Promise<void> {
    await ipcRenderer.invoke(ipcEvents.LOGIN, token);
    dispatch((store) => ({ ...store, loggedIn: true }));
  };
}

function logout(dispatch: Update) {
  return async function (): Promise<void> {
    await ipcRenderer.invoke(ipcEvents.LOGOUT);
    dispatch((store) => ({ ...store, loggedIn: false }));
  };
}

function getUser(dispatch: Update) {
  return async function (): Promise<void> {
    const res = (await ipcRenderer.invoke(ipcEvents.GET_USER)) as unknown;
    assertConfig(res);
    dispatch(res);
  };
}

function assertConfig(_: unknown): asserts _ is SharedConfig {
  // TODO
}
