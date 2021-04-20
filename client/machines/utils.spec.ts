import { assertEventType } from './utils';

describe('assertEventType', () => {
  it('narrows event type passed in', () => {
    expect(() => assertEventType({ type: 'foo' }, 'foo')).not.toThrow();
    expect(() => assertEventType({ type: 'foo' }, 'bar')).toThrow();
  });
});
