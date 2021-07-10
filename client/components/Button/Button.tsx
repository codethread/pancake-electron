import styled from 'styled-components';
import React, { ButtonHTMLAttributes, FC } from 'react';
import { isTest } from '@shared/constants';

export interface IButton {
  disabled?: boolean;
  fullWidth?: boolean;
  mode?: 'primary' | 'secondary' | 'tertiary';
  type?: ButtonHTMLAttributes<unknown>['type'];
  onClick: ButtonHTMLAttributes<unknown>['onClick'];
}

interface IButtonStyle {
  disabled?: boolean;
  fullWidth?: boolean;
}

const ButtonContainer = styled.div<IButtonStyle>`
  min-width: 150px;
  margin-bottom: ${({ theme }) => theme.spacing.large}px;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  min-height: 40px;
  //border: thin solid hotpink;
`;

const BaseButton = styled.button<IButton>`
  margin-bottom: ${({ theme }) => theme.spacing.large}px;
  border-radius: 20px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);
  padding: 0 20px;
  ${({ theme }) => ({ ...theme.typography.h5 })};
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  color: ${({ disabled, theme }) => (disabled ? '#BEBEBE' : theme.palette.white)};
`;

const PrimaryButton = styled(BaseButton)`
  height: 100%;
  width: 100%;

  transition: background-size 0.2s ease;

  background-size: 100%;
  border: none;
  background-image: ${({ theme, disabled }) =>
    disabled ? 'none' : theme.palette.gradients.rainbow()};

  &:hover {
    background-size: 200%;
  }

  // give this another look in context
  // &:focus {
  //   outline: none;
  //   box-shadow: 0 0 3pt 2pt ${({ theme }) => theme.palette.red};
  // }
`;

const border = 2;

const GradientBox = styled.div<IButtonStyle>`
  height: 100%;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);

  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  box-sizing: border-box;
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
  const { fullWidth, type, disabled, mode, onClick } = defaultProps(props);

  return (
    <div style={{ display: 'flex' }}>
      <ButtonContainer fullWidth={fullWidth}>
        {(() => {
          switch (mode) {
            case 'secondary':
              return (
                <GradientBox fullWidth={fullWidth} disabled={disabled}>
                  <Secondary
                    type={type}
                    fullWidth={fullWidth}
                    disabled={disabled}
                    onClick={onClick}
                  >
                    {children}
                  </Secondary>
                </GradientBox>
              );
            case 'tertiary':
              return (
                <PrimaryButton
                  type={type}
                  fullWidth={fullWidth}
                  disabled={disabled}
                  onClick={onClick}
                >
                  {children}
                </PrimaryButton>
              );
            default:
            case 'primary':
              return (
                <PrimaryButton
                  type={type}
                  fullWidth={fullWidth}
                  disabled={disabled}
                  onClick={onClick}
                >
                  {children}
                </PrimaryButton>
              );
          }
        })()}
      </ButtonContainer>
    </div>
  );
};

const ButtonStub: FC<IButton> = ({ children, ...props }) => (
  // eslint-disable-next-line react/button-has-type,react/jsx-props-no-spreading
  <button {...defaultProps(props)}>{children}</button>
);

export const Button = (useStub = isTest): FC<IButton> => (useStub ? ButtonStub : ButtonComp);
