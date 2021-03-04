import { Application } from 'spectron';
import { join } from 'path';

describe('stubbed integration tests', () => {
  const app = new Application({
    path: 'node_modules/.bin/electron',
    args: [join(__dirname, '../..'), '--no-sandbox'],
  });

  beforeEach(async () => {
    await app.start();
  });

  afterEach(async () => {
    if (app.isRunning()) {
      await app.stop();
    }
  });

  it('opens an app with a window', async () => {
    const title = await app.client.getTitle();
    expect(title).toBe('Pancake');
  });
});
