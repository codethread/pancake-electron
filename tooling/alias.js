const path = require('path');

const root = process.cwd();

const shared = {
  '@shared': path.resolve(root, 'shared'),
  'package.json': path.resolve(root, 'package.json'),
};

module.exports = {
  shared,
};
