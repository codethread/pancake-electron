import { theme } from './theme';

describe('theme', () => {
  it('looks about right', () => {
    expect(theme).toMatchSnapshot();
  });

  it('creates gradients', () => {
    const { gradients } = theme.palette;
    const keys: Array<keyof typeof gradients> = [
      'rainbow',
      'background',
      'masthead',
      'glassEdge',
      'vibrant',
    ];
    keys.forEach((key) => {
      const fn = gradients[key];
      if (typeof fn === 'function') {
        expect(fn()).toMatchSnapshot();
        expect(fn(66)).toMatchSnapshot();
      }
    });
  });
});
