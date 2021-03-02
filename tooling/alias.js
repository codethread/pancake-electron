/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const root = process.cwd();

const shared = {
  shared: path.resolve(root, 'shared'),
};

module.exports = {
  shared,
};
