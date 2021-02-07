import React, {
  createContext,
  Dispatch,
  FC,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { ipcRenderer } from 'electron';
import { ipcEvents } from '../../shared/ipcEvents';
import { SharedConfig, sharedConfig } from '../../shared/sharedConfig';

const err = new Error('store not initialised');
const defaultContext = {
  store: sharedConfig,
  fetch: {
    login: async (_: string): Promise<void> => Promise.reject(err),
    logout: async (): Promise<void> => Promise.reject(err),
    getUser: async (): Promise<void> => Promise.reject(err),
  },
};

const StoreContext = createContext(defaultContext);

export const useStore = (): typeof defaultContext => useContext(StoreContext);

export const StoreProvider: FC = ({ children }) => {
  const [store, dispatch] = useReducer(reducer, sharedConfig);

  useEffect(() => {
    (async (): Promise<void> => {
      const res = (await ipcRenderer.invoke(ipcEvents.SS_READ)) as unknown;
      assertConfig(res);
      dispatch({ type: 'reload', data: res });
    })().catch((err) => {
      console.error(err);
    });
  }, []);

  useEffect(() => {
    ipcRenderer.on(ipcEvents.SS_UPDATE, (_, sharedStore: unknown) => {
      assertConfig(sharedStore);
      dispatch({ type: 'reload', data: sharedStore });
    });
  }, []);

  return (
    <StoreContext.Provider
      value={{
        store,
        fetch: {
          login: login(dispatch),
          logout: logout(dispatch),
          getUser: getUser(dispatch),
        },
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

function login(dispatch: Dispatch<Action>) {
  return async function (token: string): Promise<void> {
    await ipcRenderer.invoke(ipcEvents.LOGIN, token);
    dispatch({ type: 'login' });
  };
}

function logout(dispatch: Dispatch<Action>) {
  return async function (): Promise<void> {
    await ipcRenderer.invoke(ipcEvents.LOGOUT);
    dispatch({ type: 'logout' });
  };
}

function getUser(dispatch: Dispatch<Action>) {
  return async function (): Promise<void> {
    const res = (await ipcRenderer.invoke(ipcEvents.GET_USER)) as unknown;
    assertConfig(res);
    dispatch({ type: 'reload', data: res });
  };
}

type Action =
  | { type: 'login' }
  | { type: 'logout' }
  | { type: 'reload'; data: SharedConfig };

function reducer(state: SharedConfig, action: Action): SharedConfig {
  switch (action.type) {
    case 'login':
      return { ...state, loggedIn: true };
    case 'logout':
      return { ...state, loggedIn: false };
    case 'reload':
      return { ...state, ...action.data };
    default:
      return state;
  }
}

function assertConfig(_: unknown): asserts _ is SharedConfig {
  // TODO
}
