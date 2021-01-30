const autoUpdater = {
  logger: null,
  checkForUpdatesAndNotify: jest.fn().mockResolvedValue(null),
};

export { autoUpdater };
