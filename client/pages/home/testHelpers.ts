import { screen } from '@test/rtl';

export async function waitForLoadingToFinish(): Promise<void> {
  await screen.findByRole('button', { name: /Create token/i });
}
