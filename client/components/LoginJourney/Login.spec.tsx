import React from 'react';
import merge from 'lodash.merge';
import { assign } from 'xstate';
import { render, screen } from '@testing-library/react';

import TestIds from '@shared/testids';
import { DeepPartial } from '@shared/tsHelpers';
import { assertEventType, LoginOptions } from '@client/machines';
import { LoginJourney } from './Login';

describe('LoginJourney', () => {
  const options: LoginOptions = {
    services: {
      validateToken: async () => Promise.resolve(),
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
    },
    guards: {
      isAuth: (context) => Boolean(context.user),
    },
  };

  function renderW(overrides?: DeepPartial<LoginOptions>): void {
    render(<LoginJourney machineOptions={merge({}, options, overrides)} />);
  }

  it('displays the greeting', () => {
    // TODO remove this once an integration is made with the server
    renderW();

    expect(screen.getByTestId(TestIds.GREETING_MESSAGE)).toBeInTheDocument();
  });

  describe('when the user is not already signed in', () => {
    it('starts logged out and user can log in', () => {
      renderW();

      expect(screen.queryByText('Bob')).not.toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: /log in/i })
      ).toBeInTheDocument();
    });

    it('allows the user to toggle the help section, which starts hidden', () => {
      renderW();

      const helpSection = /help section/i;
      const toggleHelp = /toggle help/i;
      expect(screen.queryByText(helpSection)).not.toBeInTheDocument();

      screen.getByRole('button', { name: toggleHelp }).click();
      expect(screen.getByText(helpSection)).toBeInTheDocument();

      screen.getByRole('button', { name: toggleHelp }).click();
      expect(screen.queryByText(helpSection)).not.toBeInTheDocument();
    });

    describe('when the user submits an invalid token', () => {
      it('greets the user with an error, and allows them to go back', async () => {
        renderW({ services: { validateToken: async () => Promise.reject() } });

        screen.getByRole('button', { name: /log in/i }).click();
        expect(await screen.findByText('invalid token')).toBeInTheDocument();

        screen.getByRole('button', { name: /back/i }).click();
        expect(screen.queryByText('invalid token')).not.toBeInTheDocument();
      });
    });

    describe('when the user submits a valid token', () => {
      describe('when the github profile fetch fails', () => {
        it('allows the user to try the again', async () => {
          const fetchSpy = jest.fn().mockRejectedValue(new Error());

          renderW({ services: { fetchUser: fetchSpy } });

          screen.getByRole('button', { name: /log in/i }).click();
          expect(await screen.findByText('no user')).toBeInTheDocument();

          fetchSpy.mockResolvedValue({ user: { name: 'bob' } });

          screen.getByRole('button', { name: /try again/i }).click();
          expect(await screen.findByText(/hello bob/i)).toBeInTheDocument();
        });

        it('allows the user to return to the submit token step', () => {});
      });

      describe('when the user is a valid user', () => {
        it('logs the user in', () => {});

        // TODO compare has config to no config
      });
    });
  });
});