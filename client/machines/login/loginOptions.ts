import { IBridge } from '@shared/types';
import { assign } from 'xstate';
import { assertEventType, LoginOptions } from '@client/machines';

export function loginOptions(bridge: IBridge): LoginOptions {
  return {
    services: {
      validateTokenPermissions: async ({ token }) =>
        (await bridge.validateAndStoreGithubToken(token ?? '')).match({
          Ok: async () => Promise.resolve(),
          Err: async (e) => Promise.reject(e),
        }),
      fetchUser: async ({ token }) =>
        (await bridge.getCurrentUser(token ?? '')).match({
          Ok: (user) => user,
          Err: () => {
            throw new Error();
          },
        }),
      loadConfig: async () => Promise.resolve(),
    },
    actions: {
      storeUser: assign({
        user: (_, e) => {
          assertEventType(e, 'done.invoke.fetchUser');
          return e.data;
        },
      }),
      clearUser: assign({
        user: (_) => undefined,
      }),
      openGithubForTokenSetup: () => {
        bridge.openGithubForTokenSetup();
      },
      storeToken: assign({
        token: (_, { token }) => token,
      }),
    },
    guards: {
      isLoggedIn: (context) => Boolean(context.user),
    },
  };
}
