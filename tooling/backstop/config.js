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
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const scenes = files.map((file) => require(file));

  return flatten(scenes).map(scenario);
}

function scenario(storyId = '') {
  return {
    label: storyId,
    // url: `http://localhost:6006/iframe.html?viewMode=story&id=${storyId}`,
    url: `http://host.docker.internal:6006/iframe.html?viewMode=story&id=${storyId}`,
  };
}

function flatten(a = []) {
  return a.reduce((flattened, cur) => flattened.concat(cur), []);
}
