import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import { Glass } from '.';
import { Button, H2, H3, lorem, P } from '..';

export default {
  title: 'Atoms/Glass',
  component: Glass,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

// const Template: Story = (args) => (
//   <Button {...args}>Button text</Button>
// );

export const Primary: Story = () => (
  <Glass>
    <H2 align="center">Welcome to Pancake</H2>
    <H3 align="center">The Pull Request Dashboard</H3>
    <P>{lorem}</P>
    <Button>With a button</Button>
    <Button>With a button</Button>
    <Button>With a button</Button>
    <P>{lorem}</P>
    <Button>With a button</Button>
  </Glass>
);
