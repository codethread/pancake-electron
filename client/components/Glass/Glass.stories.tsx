import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import styled, { keyframes } from 'styled-components';
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

const fadeIn = keyframes`
  0% {
    left: 100px;
  }
  50% {
    left: 300px;
  }
  100% {
    left: 100px;
  }
`;

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 300px;
  height: 300px;
  border-radius: 150px;
  z-index: -1;
  box-shadow: 0 0 9px 9px ${({ theme }) => theme.palette.background} inset;

  background-color: chocolate;

  animation: 5s ${fadeIn} ease-in-out infinite;
`;

export const WithBackground: Story = () => (
  <>
    <Glass>
      <H2>Heading three</H2>
    </Glass>
    <Background />
  </>
);
