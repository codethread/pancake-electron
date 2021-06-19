// eslint-disable-next-line import/no-extraneous-dependencies
import { createMachine, StateWithMatches } from '@xstate/compiled';
import type { _User } from '@shared/graphql';
import { UserStore } from '@shared/types';
import { MachineOptions, MachineSend, Matches } from '../utils';

export interface PageContext {
  user?: _User;
  token?: string;
}

export type PageEvent =
  | { type: 'BACK' }
  | { type: 'CREATE_TOKEN' }
  | { type: 'done.invoke.fetchUser'; data: _User }
  | { type: 'done.invoke.loadConfig'; config: UserStore }
  | { type: 'LAUNCH' }
  | { type: 'LOGOUT' }
  | { type: 'TOGGLE_HELP' }
  | { type: 'TRY_AGAIN' }
  | { type: 'VALIDATE'; token: string };

export type LoginOptions = MachineOptions<PageContext, PageEvent, 'login'>;
export type LoginMatches = Matches<PageContext, PageEvent, 'login'>;
export type LoginState = StateWithMatches<PageContext, PageEvent, 'login'>;
export type LoginSend = MachineSend<PageContext, PageEvent, 'login'>;

export const loginMachine = createMachine<PageContext, PageEvent, 'login'>({
  id: 'loginMachine',
  initial: 'authorize',
  context: {},
  states: {
    authorize: {
      invoke: {
        src: 'loadConfig',
        onDone: [
          {
            cond: 'isLoggedIn',
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
      initial: 'inputToken',
      states: {
        inputToken: {
          id: 'inputToken',
          type: 'parallel',
          states: {
            help: {
              initial: 'hidden',
              states: {
                hidden: {
                  on: {
                    TOGGLE_HELP: 'show',
                  },
                },
                show: {
                  on: {
                    TOGGLE_HELP: 'hidden',
                  },
                },
              },
            },
            createToken: {
              initial: 'active',
              states: {
                active: {
                  on: {
                    CREATE_TOKEN: {
                      target: 'pending',
                      actions: ['openGithubForTokenSetup'],
                    },
                  },
                },
                pending: {
                  after: {
                    500: 'active',
                  },
                },
              },
            },
          },
          on: {
            VALIDATE: {
              target: 'validateToken',
              actions: 'storeToken',
            },
          },
        },
        validateToken: {
          id: 'validateToken',
          initial: 'validatingToken',
          states: {
            validatingToken: {
              invoke: {
                src: 'validateTokenPermissions',
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
