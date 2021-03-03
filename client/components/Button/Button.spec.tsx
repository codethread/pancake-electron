import React from 'react';
import { render } from '@testing-library/react';
import Button from './index';

const a: number = 'hi';
describe('thing', () => {
  test('button should renders', () => {
    const { getByText } = render(<Button>ButtonContent</Button>);

    fetch('').then(console.log).catch(console.error);
    expect(getByText('ButtonContent')).toBeTruthy();
    expect(getByText('ButtonContent')).toHaveAttribute('type', 'button');
  });
});
