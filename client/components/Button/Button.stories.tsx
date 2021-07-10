import React from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import { BorderBox } from '@client/components/StoryHelpers';
import { IButton } from './Button';
import { Button } from './index';

export default {
  title: 'Atoms/Button',
  component: Button,
  args: {
    disabled: false,
    fullWidth: false,
  },
  argTypes: { onClick: { action: 'clicked' } },
} as Meta<IButton>;

export const Primary: Story<IButton> = (args) => (
  <BorderBox>
    <Button {...args}>Primary Button</Button>
  </BorderBox>
);

export const PrimaryFull: Story<IButton> = (args) => (
  <BorderBox>
    <Button {...args} fullWidth>
      Primary Button
    </Button>
  </BorderBox>
);

export const Secondary: Story<IButton> = (args) => (
  <BorderBox>
    <Button {...args} disabled={args.disabled} mode="secondary">
      Secondary
    </Button>
  </BorderBox>
);

export const SecondaryFull: Story<IButton> = (args) => (
  <BorderBox>
    <Button {...args} disabled={args.disabled} mode="secondary" fullWidth>
      Secondary
    </Button>
  </BorderBox>
);

export const Mixed: Story<IButton> = (args) => (
  <BorderBox>
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
      }}
    >
      <Button {...args}>Primary Button</Button>
      <Button {...args} mode="secondary">
        Secondary
      </Button>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Button {...args} fullWidth>
        I am full width prime
      </Button>
      <Button {...args} mode="secondary">
        Secondary
      </Button>
    </div>
    <Button {...args}>Primary Button</Button>
    <Button {...args}>Primary Button with lots of text</Button>
    <Button {...args} mode="secondary" fullWidth>
      I am full width secondary
    </Button>
  </BorderBox>
);
