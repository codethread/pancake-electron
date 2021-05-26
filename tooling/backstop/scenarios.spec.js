const getScenarios = require('./scenarios');

describe('getScenarios', () => {
  it('should run', () => {
    const parseMock = jest.fn().mockReturnValueOnce(['A', 'B']).mockReturnValueOnce(['C']);
    const globMock = jest.fn().mockReturnValue(['fileA', 'fileB']);

    const scenes = getScenarios(parseMock, globMock);

    expect(globMock).toHaveBeenCalled();
    expect(scenes).toStrictEqual([
      {
        label: 'A',
        url: `http://host.docker.internal:6006/iframe.html?viewMode=story&id=A`,
      },
      {
        label: 'B',
        url: `http://host.docker.internal:6006/iframe.html?viewMode=story&id=B`,
      },
      {
        label: 'C',
        url: `http://host.docker.internal:6006/iframe.html?viewMode=story&id=C`,
      },
    ]);
  });
});
