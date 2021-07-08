/* eslint-disable react/jsx-props-no-spreading */
import styled from 'styled-components';
import React, { ButtonHTMLAttributes, FC } from 'react';
import { isTest } from '@shared/constants';

export interface IButton {
  disabled?: boolean;
  fullWidth?: boolean;
  mode?: 'primary' | 'secondary' | 'tertiary';
  type?: ButtonHTMLAttributes<unknown>['type'];
}

const BaseButton = styled.button<IButton>`
  min-width: 150px;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};

  margin-bottom: ${({ theme }) => theme.spacing.large}px;
  height: 40px;
  border-radius: 20px;
  // box-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);
  padding: 0 20px;
  ${({ theme }) => ({ ...theme.typography.h5 })};
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  color: ${({ disabled, theme }) => (disabled ? '#BEBEBE' : theme.palette.white)};
`;

const PrimaryButton = styled(BaseButton)`
  transition: background-size 0.2s ease;

  background-size: 100%;
  &:hover {
    background-size: 200%;
  }

  // give this another look in context
  // &:focus {
  //   outline: none;
  //   box-shadow: 0 0 3pt 2pt ${({ theme }) => theme.palette.red};
  // }

  border: none;
  background-image: ${({ theme, disabled }) =>
    disabled ? 'none' : theme.palette.gradients.rainbow()};
`;

const border = 2;

const GradientBox = styled.div<IButton>`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '150px')};
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  height: 40px;
  background-image: ${(props) =>
    props.disabled
      ? 'linear-gradient(0deg, #253C38, #253C38)'
      : props.theme.palette.gradients.secondary};
  background-clip: padding-box;
  border: solid ${border}px transparent;
  border-radius: 20px;
  transition: background-size 0.2s ease;
  &:hover,
  &:focus {
    background-size: 150%;
  }
  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    margin: -${border}px;
    border-radius: inherit;
    background-image: ${(props) =>
      props.disabled
        ? 'linear-gradient(0deg, #47615D, #47615D)'
        : props.theme.palette.gradients.rainbow()};
  }
`;

const Secondary = styled(BaseButton)`
  // background-image: ${(props) => props.theme.palette.gradients.secondary};
  border: none;
  box-shadow: none;
  background-color: transparent;
`;

const defaultProps = (props: IButton): Required<IButton> => ({
  type: 'button',
  disabled: false,
  fullWidth: false,
  mode: 'primary',
  ...props,
});

export const ButtonComp: FC<IButton> = ({ children, ...props }) => {
  const propsWithDefaults = defaultProps(props);

  switch (propsWithDefaults.mode) {
    case 'secondary':
      return (
        <GradientBox {...propsWithDefaults}>
          <Secondary {...propsWithDefaults}>{children}</Secondary>
        </GradientBox>
      );
    case 'tertiary':
      return <PrimaryButton {...propsWithDefaults}>{children}</PrimaryButton>;
    default:
    case 'primary':
      return <PrimaryButton {...propsWithDefaults}>{children}</PrimaryButton>;
  }
};

const ButtonStub: FC<IButton> = ({ children, ...props }) => (
  // eslint-disable-next-line react/button-has-type
  <button {...defaultProps(props)}>{children}</button>
);

export const Button = (useStub = isTest): FC<IButton> => (useStub ? ButtonStub : ButtonComp);
