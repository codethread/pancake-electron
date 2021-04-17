import React from 'react';
import { render, screen } from '@testing-library/react';
import TestIds from '@shared/testids';
import { LoginJourney } from './Login';

describe('LoginJourney', () => {
  beforeEach(() => {
    render(<LoginJourney />);
  });

  it('displays the greeting', () => {
    expect(screen.getByTestId(TestIds.GREETING_MESSAGE)).toBeInTheDocument();
  });
});
