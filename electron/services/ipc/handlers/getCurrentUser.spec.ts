import { createFakeBridge } from './createFakeBridge';

describe('getCurrentUser', () => {
  test.each`
    title        | result
    ${'initial'} | ${'lol'}
  `('$title', async ({ result }) => {
    const bridge = createFakeBridge();

    const res = await bridge.getCurrentUser();

    expect(res).toMatchResult(result);
  });
});
