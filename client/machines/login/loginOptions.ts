import { IBridge } from '@shared/types';
import { assign } from 'xstate';
import { assertEventType, LoginOptions } from '@client/machines';

export function loginOptions(bridge: IBridge): LoginOptions {
  return {
    services: {
      validateTokenPermissions: async ({ token }) =>
        (await bridge.validateGithubToken(token ?? '')).match({
          Ok: async () => Promise.resolve(),
          Err: async (e) => Promise.reject(e),
        }),
      loadConfig: async () => Promise.resolve(),
      fetchUser: async () => Promise.resolve({ user: { name: 'bob' } }),
    },
    actions: {
      storeUser: assign({
        user: (_, e) => {
          assertEventType(e, 'done.invoke.fetchUser');
          return e.data.user;
        },
      }),
      clearUser: assign({
        user: (_) => null,
      }),
      openGithubForTokenSetup: () => {
        bridge.openGithubForTokenSetup();
      },
      storeToken: assign({
        token: (_, { token }) => token,
      }),
    },
    guards: {
      isAuth: (context) => Boolean(context.user),
    },
  };
}
