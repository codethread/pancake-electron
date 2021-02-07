import React, { createContext, Dispatch, FC, useReducer } from 'react';
import { ipcRenderer } from 'electron';
import { ipcEvents } from '../../shared/ipcEvents';

type TempStore = {
  loggedIn: boolean;
};

const defaultStore: TempStore = {
  loggedIn: false,
};

const err = new Error('store not initialised');
const defaultContext = {
  store: defaultStore,
  fetch: {
    login: async (_: string): Promise<void> => Promise.reject(err),
    logout: async (): Promise<void> => Promise.reject(err),
  },
};

export const StoreContext = createContext(defaultContext);

export const StoreProvider: FC = ({ children }) => {
  const [store, dispatch] = useReducer(reducer, defaultStore);

  return (
    <StoreContext.Provider
      value={{
        store,
        fetch: { login: login(dispatch), logout: logout(dispatch) },
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

function login(dispatch: Dispatch<Action>) {
  return async function (token: string): Promise<void> {
    await ipcRenderer.invoke(ipcEvents.LOG_ING, token);
    dispatch({ type: 'login' });
  };
}

function logout(dispatch: Dispatch<Action>) {
  return async function (): Promise<void> {
    await ipcRenderer.invoke(ipcEvents.LOG_OUT);
    dispatch({ type: 'logout' });
  };
}

type Action = { type: 'login' } | { type: 'logout' };

function reducer(state: TempStore, action: Action): TempStore {
  switch (action.type) {
    case 'login':
      return { ...state, loggedIn: true };
    case 'logout':
      return { ...state, loggedIn: false };
    default:
      return state;
  }
}
