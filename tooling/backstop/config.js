const getScenarios = require('./scenarios');

module.exports = {
  id: 'pancake_storybook',
  viewports: [
    {
      label: 'thin',
      width: 430,
      height: 900,
    },
    {
      label: 'half',
      width: 1080,
      height: 768,
    },
    {
      label: 'full',
      width: 1920,
      height: 768,
    },
  ],
  scenarios: getScenarios(),
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
