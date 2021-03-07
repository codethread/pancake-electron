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
  },
} as Meta;

const Template: Story<IButton> = ({ onClick }) => (
  <Button onClick={onClick}>Button text</Button>
);

export const Primary = Template.bind({});
Primary.args = {
  onClick: action('button clicked'),
};
