const glob = require('fast-glob');

const rootPath = process.cwd();

const scenarios = glob.sync(`${rootPath}/client/**/*backstop.js`);

module.exports = {
  id: 'pancake_storybook',
  viewports: [
    {
      label: 'phone',
      width: 320,
      height: 480,
    },
    {
      label: 'tablet',
      width: 1024,
      height: 768,
    },
  ],
  scenarios: createScenarios(scenarios),
  paths: {
    bitmaps_reference: 'tooling/backstop_data/bitmaps_reference',
    bitmaps_test: 'tooling/backstop_data/bitmaps_test',
    html_report: 'tooling/backstop_data/html_report',
    ci_report: 'tooling/backstop_data/ci_report',
  },
  report: ['browser'],
  engine: 'puppeteer',
  engineOptions: {
    args: ['--no-sandbox'],
  },
  asyncCaptureLimit: 5,
  asyncCompareLimit: 50,
  debug: false,
  debugWindow: false,
};

// helpers

function createScenarios(files = []) {
  const scenes = files.map((file) => require(file)); // eslint-disable-line

  return flatten(scenes).map(scenario);
}

function scenario(storyId = '') {
  return {
    label: storyId,
    url: `http://host.docker.internal:6006/iframe.html?viewMode=story&id=${storyId}`,
  };
}

/**
 *
 * @param {Array<any>} a
 * @returns {Array<any>} one layer flatten of a
 */
function flatten(a = []) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  return a.reduce((flattened, cur) => flattened.concat(cur), []);
}
