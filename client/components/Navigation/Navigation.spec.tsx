import React from 'react';
import pj from 'package.json';
import { render, screen } from '@test/rtl';
import userEvent from '@testing-library/user-event';
import { bridge } from '@test/bridge';
import { Navigation } from './Navigation';

describe('the app version', () => {
  const renderW = (): void => {
    render(<Navigation bridge={bridge} />);
  };

  it('should be the version in the package.json', () => {
    renderW();
    expect(screen.getByText(pj.version)).toBeInTheDocument();
  });

  it('should be hidden from screen readers', () => {
    renderW();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { hidden: true })).toBeInTheDocument();
  });

  it('should send a test bridge message when the version is clicked', () => {
    renderW();
    userEvent.click(screen.getByRole('button', { hidden: true }));
    expect(bridge.test).toHaveBeenCalledWith('test bridge message');
  });
});
