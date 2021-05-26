import { app } from './init';

describe('plumbing tests', () => {
  beforeEach(async () => {
    if (app.isRunning()) {
      await app.restart();
    } else {
      await app.start();
    }
  });

  afterAll(async () => {
    if (app.isRunning()) {
      await app.stop();
    }
  });

  describe('given user is not logged in', () => {
    test('when a user tries to create a token, they are taken to github', async () => {
      const create = await app.client.$('button=Create token');
      await create.click();

      const logs = await app.client.getMainProcessLogs();
      const log = logs.find((l) => l.includes('STUBBED SHELL')) ?? '';

      expect(log).toMatch('open');
      expect(log).toMatch('https://github.com/settings/tokens/new');
    });

    test('when a user adds a token, they are logged in and presented with the option to launch their dashboard', async () => {
      const input = await app.client.$('label=Paste your token here');
      await input.addValue('f'.repeat(40));

      const submit = await app.client.$('button=Submit Token');
      await submit.click();

      await app.client.$('button=Launch my dashboard');
    });

    test.todo('when a user clicks the Launch button, they are presented with their dashboard');
  });

  describe('given a user is logged in', () => {
    test.todo('when they click logout, they are returned to the log in screen');
  });
});
