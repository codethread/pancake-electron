const path = require('path');

const root = process.cwd();

const shared = {
  shared: path.resolve(root, 'shared'),
};

module.exports = {
  shared,
};
