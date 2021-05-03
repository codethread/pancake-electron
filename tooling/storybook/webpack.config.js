const { client, shared } = require('../webpack/alias');

module.exports = ({ config }) => {
  // // a bunch of other rules here
  //
  // config.resolve.modules = [
  //   path.resolve(__dirname, "..", "src"),
  //   "node_modules",
  // ]

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,no-param-reassign
  config.resolve.alias = {
    ...shared,
    ...client,
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return config;
};
