import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('thing', () => {
  test('button should renders', () => {
    render(<Button>ButtonContent</Button>);

    expect(screen.getByText('ButtonContent')).toBeTruthy();
    expect(screen.getByText('ButtonContent')).toHaveAttribute('type', 'button');
  });
});
