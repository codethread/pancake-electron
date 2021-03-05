import { Application } from 'spectron';
import { join } from 'path';

describe('stubbed integration tests', () => {
  const app = new Application({
    path: 'node_modules/.bin/electron',
    args: [
      // this points to the project root to find the package.json
      // the `main` entry is then used
      join(__dirname, '../..'),
      // this seems to be required to run in headless mode
      // have raised #36 to investigate
      '--no-sandbox',
    ],
    requireName: 'electronRequire',
    env: {
      // enables certain features such as nodeIntegration to allow spectron to
      // hook into the running electron process
      INTEGRATION: true,
    },
  });

  beforeEach(async () => {
    if (app.isRunning()) {
      await app.restart();
    } else {
      await app.start();
    }
    // play around with this, but too fast (500) seemed to stop the window closing
    // await app.client.setTimeout({ implicit: 1500 });
  });

  afterAll(async () => {
    if (app.isRunning()) {
      await app.stop();
    }
  });

  it('opens an app with a window', async () => {
    const title = await app.client.getTitle();
    expect(title).toBe('Pancake');
  });

  it('bridge event from client is logged by electron', async () => {
    const button = await app.client.$('button=Test Button');
    expect(await button.getText()).toBe('Test Button');
  });
});
