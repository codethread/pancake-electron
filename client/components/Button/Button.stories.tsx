import React from 'react';
import { Story, Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Button } from '.';
import { IButton } from './Button';

export default {
  title: 'Atoms/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
    primary: { control: 'boolean' },
  },
} as Meta;

const Template: Story<IButton> = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Button {...props}>Button text</Button>
);

export const Primary = Template.bind({});
Primary.args = {
  onClick: action('button clicked'),
  primary: true,
};

export const Secondary = Template.bind({});
Secondary.args = {
  onClick: action('button clicked'),
};
