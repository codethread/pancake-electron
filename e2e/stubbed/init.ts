import { Application } from 'spectron';
import { join } from 'path';

export const app = new Application({
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
