import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import styled from 'styled-components';
import { Glass } from './Glass';
import { H2, H3, lorem, P } from '..';

export default {
  title: 'Atoms/Glass',
  component: Glass,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Button = styled.button``;

export const Empty: Story = () => <Glass />;

export const Simple: Story = () => (
  <Glass>
    <H2>Heading three</H2>
  </Glass>
);

export const WithContent: Story = () => (
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
