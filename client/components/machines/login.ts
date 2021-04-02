// eslint-disable-next-line import/no-extraneous-dependencies
import { createMachine } from '@xstate/compiled';

export interface User {
  name: string;
}

export interface PageContext {
  user?: User;
  token?: string;
}

export type PageEvent =
  | { type: 'BACK' }
  | { type: 'done.invoke.fetchUser'; data: { user: User } }
  | { type: 'LAUNCH' }
  | { type: 'LOGOUT' }
  | { type: 'TOGGLE_HELP' }
  | { type: 'TRY_AGAIN' }
  | { type: 'VALIDATE'; token: string };

export const loginMachine = createMachine<PageContext, PageEvent, 'uniq'>({
  initial: 'authorize',
  context: {},
  states: {
    authorize: {
      on: {
        '': [
          {
            cond: 'isAuth',
            target: 'loggedIn',
          },
          {
            target: 'loggedOut',
          },
        ],
      },
    },
    loggedIn: {
      id: 'loggedIn',
      on: {
        LOGOUT: {
          target: 'loggedOut',
          actions: ['clearUser'],
        },
      },
    },
    loggedOut: {
      id: 'loggedOut',
      initial: 'createToken',
      states: {
        createToken: {
          id: 'createToken',
          initial: 'noHelp',
          states: {
            noHelp: {
              on: {
                TOGGLE_HELP: 'help',
              },
            },
            help: {
              on: {
                TOGGLE_HELP: 'noHelp',
              },
            },
          },
          on: {
            VALIDATE: 'validateToken',
          },
        },
        validateToken: {
          initial: 'validatingToken',
          states: {
            validatingToken: {
              invoke: {
                src: 'validateToken',
                onDone: 'fetchingProfile',
                onError: 'invalidToken',
              },
            },
            invalidToken: {
              on: {
                BACK: '#loggedOut',
              },
            },
            fetchingProfile: {
              invoke: {
                src: 'fetchUser',
                onDone: {
                  target: 'loadingConfig',
                  actions: 'storeUser',
                },
                onError: 'profileFailure',
              },
            },
            profileFailure: {
              on: {
                TRY_AGAIN: 'fetchingProfile',
                BACK: '#loggedOut',
              },
            },
            loadingConfig: {
              invoke: {
                src: 'loadConfig',
                onDone: 'hasConfig',
                onError: 'noConfig',
              },
            },
            noConfig: {
              on: {
                LAUNCH: '#loggedIn',
              },
            },
            hasConfig: {
              on: {
                LAUNCH: '#loggedIn',
              },
            },
          },
        },
      },
    },
  },
});
