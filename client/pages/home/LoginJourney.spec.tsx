import React from 'react';
import { render, screen, waitFor } from '@test/rtl';
import userEvent from '@testing-library/user-event';

import { loginOptions } from '@client/machines';
import { bridge } from '@test/bridge';
import { IBridge } from '@shared/types';
import { merge } from '@shared/merge';
import { err, ok } from '@shared/Result';
import { createMockFn } from '@test/createMockFn';
import { exampleUser } from '@test/fixtures/github';
import { waitForLoadingToFinish } from './testHelpers';
import { LoginJourney } from './LoginJourney';

function renderW(overrides: Partial<IBridge> = {}): void {
  const fakeBridge = merge(bridge, overrides);
  const machineOptions = loginOptions(fakeBridge);

  render(<LoginJourney machineOptions={machineOptions} />);
}

async function renderAndWaitForLoadingToFinish(
  overrides: Parameters<typeof renderW>[0] = {}
): Promise<void> {
  renderW(overrides);
  await waitForLoadingToFinish();
}

const userGreeting = new RegExp(`hello ${exampleUser.viewer.name}`, 'i');

describe('LoginJourney', () => {
  it('should display the loading spinner at startup', async () => {
    renderW();
    expect(screen.queryByText(userGreeting)).not.toBeInTheDocument();
    // let the component finish rendering to prevent any `act` warnings
    await screen.findByRole('button', { name: /Create token/i });
  });

  describe('when the user is not already signed in', () => {
    it('renders a link to create a new token from github, which has a delay before it can be clicked again', async () => {
      await renderAndWaitForLoadingToFinish();

      const button = await screen.findByRole('button', { name: /Create token/i });
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

    it('allows the user to toggle the help section, which starts hidden', async () => {
      await renderAndWaitForLoadingToFinish();

      const helpSection = /help section/i;
      const toggleHelp = /toggle help/i;
      expect(screen.queryByText(helpSection)).not.toBeInTheDocument();

      screen.getByRole('button', { name: toggleHelp }).click();
      expect(screen.getByText(helpSection)).toBeInTheDocument();

      screen.getByRole('button', { name: toggleHelp }).click();
      expect(screen.queryByText(helpSection)).not.toBeInTheDocument();
    });

    describe('when the user inputs an invalid token', () => {
      it('should display errors to the client and disable the submit button', async () => {
        await renderAndWaitForLoadingToFinish();

        const input = screen.getByLabelText(/paste your token here/i);
        userEvent.type(input, 'too short');

        expect(screen.queryByText("That doesn't look like a valid token!")).not.toBeInTheDocument();

        const button = screen.getByRole('button', { name: /submit token/i });

        userEvent.click(button);

        expect(
          await screen.findByText("That doesn't look like a valid token!")
        ).toBeInTheDocument();
        expect(screen.getByText('at least 40 characters required')).toBeInTheDocument();
        expect(screen.getByText('only alpha numeric characters and "_"')).toBeInTheDocument();

        expect(button).toBeDisabled();
      });

      it('should continue to show errors until the input is cleared', async () => {
        await renderAndWaitForLoadingToFinish();

        const input = screen.getByLabelText(/paste your token here/i);
        userEvent.type(input, 'rubbish token');
        userEvent.type(input, '{enter}');

        expect(
          await screen.findByText("That doesn't look like a valid token!")
        ).toBeInTheDocument();

        userEvent.clear(input);

        expect(screen.queryByText("That doesn't look like a valid token!")).not.toBeInTheDocument();
      });

      it('should continue to show errors until all the errors are resolved', async () => {
        await renderAndWaitForLoadingToFinish();

        const input = screen.getByLabelText(/paste your token here/i);
        userEvent.type(input, 'too_short-');

        expect(screen.queryByText("That doesn't look like a valid token!")).not.toBeInTheDocument();

        screen.getByRole('button', { name: /submit token/i }).click();

        expect(
          await screen.findByText("That doesn't look like a valid token!")
        ).toBeInTheDocument();

        expect(screen.getByText('at least 40 characters required'));
        expect(screen.getByText('only alpha numeric characters and "_"'));

        userEvent.type(input, '{backspace}');

        expect(screen.getByText('at least 40 characters required')).toBeInTheDocument();
        expect(screen.queryByText('only alpha numeric characters and "_"')).not.toBeInTheDocument();

        expect(screen.getByText("That doesn't look like a valid token!")).toBeInTheDocument();

        userEvent.type(input, 'f'.repeat(40));

        expect(screen.queryByText("That doesn't look like a valid token!")).not.toBeInTheDocument();

        const button = screen.getByRole('button', { name: /submit token/i });
        expect(button).toBeEnabled();
      });
    });

    it('should allow toggling of the token display', async () => {
      await renderAndWaitForLoadingToFinish();

      const input = screen.getByLabelText(/paste your token here/i);
      expect(input).toHaveAttribute('type', 'password');

      userEvent.click(screen.getByRole('button', { name: /toggle token visibility/i }));
      expect(input).toHaveAttribute('type', 'text');

      userEvent.click(screen.getByRole('button', { name: /toggle token visibility/i }));
      expect(input).toHaveAttribute('type', 'password');
    });

    describe('when the user submits an invalid token', () => {
      it('greets the user with an error, and allows them to go back', async () => {
        await renderAndWaitForLoadingToFinish({
          validateAndStoreGithubToken: async () => err(''),
        });

        insertValidToken();
        screen.getByRole('button', { name: /submit token/i }).click();
        expect(await screen.findByText('invalid token')).toBeInTheDocument();

        screen.getByRole('button', { name: /back/i }).click();
        expect(screen.queryByText('invalid token')).not.toBeInTheDocument();
      });
    });

    describe('when the user submits a valid token', () => {
      describe('when the github profile fetch fails', () => {
        it('allows the user to try the again', async () => {
          const getCurrentUser = createMockFn<IBridge['getCurrentUser']>()
            .mockResolvedValueOnce(err('could not get user'))
            .mockResolvedValueOnce(ok(exampleUser));

          await renderAndWaitForLoadingToFinish({ getCurrentUser });

          insertValidToken();
          screen.getByRole('button', { name: /submit token/i }).click();
          expect(await screen.findByText('no user')).toBeInTheDocument();

          screen.getByRole('button', { name: /try again/i }).click();
          expect(await screen.findByText(userGreeting)).toBeInTheDocument();
        });

        it('allows the user to return to the submit token step', async () => {
          const getCurrentUser: IBridge['getCurrentUser'] = async () => err('could not get user');

          await renderAndWaitForLoadingToFinish({ getCurrentUser });

          insertValidToken();
          screen.getByRole('button', { name: /submit token/i }).click();
          expect(await screen.findByText('no user')).toBeInTheDocument();

          screen.getByRole('button', { name: /back/i }).click();
          expect(screen.queryByText('no user')).not.toBeInTheDocument();
        });
      });

      describe('when the user is a valid user', () => {
        it('lets the user launch their dashboard and sign out', async () => {
          await renderAndWaitForLoadingToFinish();

          insertValidToken();
          screen.getByRole('button', { name: /submit token/i }).click();

          expect(await screen.findByText(userGreeting)).toBeInTheDocument();
          expect(screen.queryByRole('button', { name: /submit token/i })).not.toBeInTheDocument();

          screen.getByRole('button', { name: /launch my dashboard/i }).click();
          expect(await screen.findByText(/dashboard/i)).toBeInTheDocument();

          screen.getByRole('button', { name: /log out/i }).click();
          expect(screen.queryByText(userGreeting)).not.toBeInTheDocument();
          expect(screen.queryByText(/dashboard/i)).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('when the user is already logged in', () => {
    it("should display the user's dashboard", async () => {
      renderW({
        loadUserConfig: async () =>
          Promise.resolve(
            ok({
              filters: [],
              user: exampleUser,
            })
          ),
      });
      expect(await screen.findByText('dashboard')).toBeInTheDocument();
    });
  });
});

function insertValidToken(): string {
  const token = 'ffffffffffffffffffffffffffffffffffffffffff';
  const input = screen.getByLabelText(/paste your token here/i);
  userEvent.type(input, token);
  return token;
}
