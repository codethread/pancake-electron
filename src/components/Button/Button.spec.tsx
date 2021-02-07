import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Button } from '.';

test('button should renders', () => {
  const spy = jest.fn();
  const { getByText } = render(
    <Button
      onClick={() => {
        spy('call');
      }}
    >
      ButtonContent
    </Button>
  );

  const btn = getByText('ButtonContent');
  expect(btn).toBeTruthy();
  expect(btn).toHaveAttribute('type', 'button');

  fireEvent.click(btn);
  expect(spy).toHaveBeenCalledWith('call');
});
