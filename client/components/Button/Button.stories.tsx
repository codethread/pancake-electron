import React from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import { IButton } from './Button';
import { Button } from './index';

export default {
  title: 'Atoms/Button',
  component: Button,
  args: {
    disabled: false,
    fullWidth: false,
  },
} as Meta<IButton>;

export const Primary: Story<IButton> = (args) => <Button {...args}>Primary Button</Button>;

export const Multiple: Story<IButton> = (args) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <Button {...args}>Primary Button</Button>
    <Button {...args}>Primary Button</Button>
  </div>
);

export const PrimaryFull: Story<IButton> = (args) => (
  <div style={{ width: '100%' }}>
    <Button {...args} fullWidth>
      Primary Button
    </Button>
  </div>
);

export const Secondary: Story<IButton> = (args) => (
  <Button disabled={args.disabled}>Secondary</Button>
);

export const SecondaryFull: Story<IButton> = (args) => (
  <div style={{ width: '100%' }}>
    <Button disabled={args.disabled} fullWidth>
      Secondary
    </Button>
  </div>
);
