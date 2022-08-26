import type { ExtensionReference } from 'electron-devtools-installer';

const installer = jest.fn<Promise<string>, ExtensionReference[]>(async (extension) =>
  Promise.resolve(extension.id)
);

export default installer;

const REACT_DEVELOPER_TOOLS: ExtensionReference = {
  electron: '',
  id: 'react-tools',
};

export { REACT_DEVELOPER_TOOLS };
