import { IBridge } from '@shared/types';
import { assign } from 'xstate';
import { assertEventType, LoginOptions } from '@client/machines';

export function loginOptions(bridge: IBridge): LoginOptions {
  return {
    services: {
      validateTokenPermissions: async ({ token }) =>
        (await bridge.validateAndStoreGithubToken(token ?? '')).match({
          Ok: () => {},
          Err: async (err) => Promise.reject(err),
        }),
      fetchUser: async () =>
        (await bridge.getCurrentUser()).match({
          Ok: (user) => user,
          Err: () => {
            throw new Error();
          },
        }),
      loadConfig: async () =>
        (await bridge.loadUserConfig()).match({
          Ok: (config) => config,
          Err: () => {
            throw new Error();
          },
        }),
      resetConfig: async () =>
        (await bridge.resetUserConfig()).match({
          Ok: (config) => config,
          Err: () => {
            throw new Error();
          },
        }),
    },
    actions: {
      storeUser: assign({
        user: (_, e) => {
          bridge.updateUserConfig({ user: e.data }).catch(() => {});
          return e.data;
        },
      }),
      storeConfig: assign((_, e) => {
        assertEventType(e, 'done.invoke.loadConfig');
        return e.data;
      }),
      openGithubForTokenSetup: () => {
        bridge.openGithubForTokenSetup();
      },
      storeToken: assign({
        token: (_, { token }) => token,
      }),
      deleteToken: assign({
        token: (_) => undefined,
      }),
    },
    guards: {
      isLoggedIn: (_, e) => Boolean(e.data.user),
    },
  };
}
