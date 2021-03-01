import React from 'react';
import styled from 'styled-components';

type Click = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;

export interface IButton {
  variant?: 'primary' | 'secondary';
  onClick?: Click;
  disabled?: boolean;
}

interface IButtonProps {
  type: 'button' | 'submit' | 'reset';
  onClick?: Click;
}

const Base = styled.button.attrs((props) => ({
  type: props.type || 'button',
}))`
  ${({ theme }) => ({ ...theme.typography.h5 })};

  min-width: 150px;
  margin-bottom: ${({ theme }) => theme.spacing.large}px;
  height: 40px;
  border-radius: 20px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);
  color: ${(props) => (props.disabled ? '#BEBEBE' : props.theme.palette.white)};
  padding: 0 20px;
  background-size: 100%;
  background-color: rgba(1, 1, 1, 0);

  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};

  transition: background-size 0.1s ease;

  &:hover,
  &:focus {
    background-size: 200%;
  }
`;

const Primary = styled(Base)`
  background-image: ${(props) =>
    props.disabled
      ? 'linear-gradient(0deg, #47615D, #47615D)'
      : props.theme.palette.gradients.rainbow()};
  border: none;
`;

const Secondary = styled(Base)`
  // background-image: ${(props) => props.theme.palette.gradients.secondary};
  border: none;
  box-shadow: none;
`;

const border = 2;
const GradientBox = styled.div<IButton>`
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  width: 150px;
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

export const Button: React.FC<IButton> = ({
  children,
  onClick,
  variant,
  disabled,
}) => {
  const props: IButtonProps = onClick
    ? { onClick, type: 'button' }
    : { type: 'submit' };
  switch (variant) {
    case 'secondary':
      return (
        <GradientBox disabled={disabled}>
          <Secondary {...props} disabled={disabled}>
            {children}
          </Secondary>
        </GradientBox>
      );
    case 'primary':
    default:
      return (
        <Primary {...props} disabled={disabled}>
          {children}
        </Primary>
      );
  }
};
