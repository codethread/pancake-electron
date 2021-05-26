const { client, shared } = require('../webpack/alias');

module.exports = ({ config }) => {
  // // a bunch of other rules here
  //
  // config.resolve.modules = [
  //   path.resolve(__dirname, "..", "src"),
  //   "node_modules",
  // ]

  // eslint-disable-next-line no-param-reassign
  config.resolve.alias = {
    ...shared,
    ...client,
  };

  return config;
};
