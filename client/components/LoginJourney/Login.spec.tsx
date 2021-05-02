import React from 'react';
import merge from 'lodash.merge';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DeepPartial } from '@shared/tsHelpers';
import { LoginOptions, loginOptions } from '@client/machines';
import { bridge } from '@test/bridge';
import { LoginJourney } from './Login';

describe('LoginJourney', () => {
  function renderW(overrides?: DeepPartial<LoginOptions>): void {
    render(
      <LoginJourney
        machineOptions={merge({}, loginOptions(bridge), overrides)}
      />
    );
  }

  it('starts the user logged out', () => {
    renderW();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
  });

  describe('when the user is not already signed in', () => {
    it('renders a link to create a new token from github, which has a delay before it can be clicked again', async () => {
      renderW();

      const button = screen.getByRole('button', { name: /Create token/i });
      userEvent.click(button);
      // difficult to test this as a behaviour
      expect(bridge.openGithubForTokenSetup).toHaveBeenCalled();

      expect(button).toBeDisabled();
      userEvent.click(button);
      expect(bridge.openGithubForTokenSetup).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(button).toBeEnabled();
      });

      userEvent.click(button);
      expect(bridge.openGithubForTokenSetup).toHaveBeenCalledTimes(2);
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

    it('should allow the user to submit a token once they enter a value', () => {
      renderW();
      const button = screen.getByRole('button', { name: /submit token/i });
      expect(button).toBeDisabled();

      insertTokenChars();
      expect(button).toBeEnabled();
    });

    it('should allow toggling of the token display', () => {
      renderW();

      const input = screen.getByLabelText(/paste your token here/i);
      expect(input).toHaveAttribute('type', 'password');

      userEvent.click(
        screen.getByRole('button', { name: /toggle token visibility/i })
      );
      expect(input).toHaveAttribute('type', 'text');

      userEvent.click(
        screen.getByRole('button', { name: /toggle token visibility/i })
      );
      expect(input).toHaveAttribute('type', 'password');
    });

    describe('when the user submits an invalid token', () => {
      it('greets the user with an error, and allows them to go back', async () => {
        renderW({ services: { validateToken: async () => Promise.reject() } });

        insertTokenChars();
        screen.getByRole('button', { name: /submit token/i }).click();
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

          insertTokenChars();
          screen.getByRole('button', { name: /submit token/i }).click();
          expect(await screen.findByText('no user')).toBeInTheDocument();

          fetchSpy.mockResolvedValue({ user: { name: 'bob' } });

          screen.getByRole('button', { name: /try again/i }).click();
          expect(await screen.findByText(/hello bob/i)).toBeInTheDocument();
        });

        it('allows the user to return to the submit token step', async () => {
          const fetchSpy = jest.fn().mockRejectedValue(new Error());

          renderW({ services: { fetchUser: fetchSpy } });

          insertTokenChars();
          screen.getByRole('button', { name: /submit token/i }).click();
          expect(await screen.findByText('no user')).toBeInTheDocument();

          screen.getByRole('button', { name: /back/i }).click();
          expect(screen.queryByText('no user')).not.toBeInTheDocument();
        });
      });

      describe('when the user is a valid user', () => {
        describe('when the user has config', () => {
          it('lets the user launch their dashboard and sign out', async () => {
            renderW();

            insertTokenChars();
            screen.getByRole('button', { name: /submit token/i }).click();

            expect(await screen.findByText(/hello bob/i)).toBeInTheDocument();

            screen.getByRole('button', { name: /launch/i }).click();
            expect(await screen.findByText(/dashboard/i)).toBeInTheDocument();

            screen.getByRole('button', { name: /log out/i }).click();
            expect(screen.queryByText(/hello bob/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/dashboard/i)).not.toBeInTheDocument();
          });
        });
      });
    });
  });
});

function insertTokenChars(): void {
  const input = screen.getByLabelText(/paste your token here/i);
  userEvent.type(input, 'some token');
}
