import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import { action } from '@storybook/addon-actions';

import { Button, IButton } from '.';

export default {
  title: 'Atoms/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<IButton> = (args) => (
  <Button {...args}>Button text</Button>
);

export const Primary = Template.bind({});

export const PrimaryDisabled = Template.bind({});
PrimaryDisabled.args = {
  disabled: true,
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: 'secondary',
};

export const SecondaryDisabled = Template.bind({});
SecondaryDisabled.args = {
  variant: 'secondary',
  disabled: true,
};

export const Clickable = Template.bind({});
Clickable.args = {
  onClick: () => {
    action('clicked');
  },
};

export const Submit = Template.bind({});
Submit.args = {
  variant: 'secondary',
};
