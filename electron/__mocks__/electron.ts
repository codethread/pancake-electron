export const app = {
  getName: jest.fn(),
  getVersion: jest.fn(),
  quit: jest.fn(),
};

export const dialog = {
  showMessageBox: jest.fn().mockResolvedValue(null),
};
