const path = require('path');

const root = process.cwd();

const shared = {
  '@shared': path.resolve(root, 'shared'),
  'package.json': path.resolve(root, 'package.json'),
};

const client = {
  '@client': path.resolve(root, 'client'),
  '@test': path.resolve(root, 'client/testsHelpers'),
};

module.exports = {
  shared,
  client,
};
