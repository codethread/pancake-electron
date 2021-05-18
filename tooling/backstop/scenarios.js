const { sync } = require('fast-glob');

module.exports = getScenarios;

function getScenarios(parse = require, glob = sync) {
  const rootPath = process.cwd();
  const scenarios = glob(`${rootPath}/client/**/*backstop.js`);
  const scenes = scenarios.map((file) => parse(file));
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
