import React from 'react';
import styled from 'styled-components';

type Click = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;

interface IButton {
  onClick?: Click;
}

const Container = styled.button`
  height: 50px;
  border-radius: 25px;
  background: ${(props) => props.theme.palette.gradients.button()};

  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  ${({ theme }) => ({ ...theme.typography.h5 })};
  color: ${({ theme }) => theme.palette.white};
`;

export const Button: React.FC<IButton> = ({ onClick, children }) =>
  onClick ? (
    <Container type="button" onClick={onClick}>
      {children}
    </Container>
  ) : (
    <Container type="submit">{children}</Container>
  );
