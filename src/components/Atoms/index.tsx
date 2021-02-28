import styled from 'styled-components';
export { Input } from './Input';

export const Img = styled.img`
  max-height: 100%;
  max-width: 100%;
`;

interface BoxProps {
  readonly fill?: boolean;
}

export const Box = styled.div<BoxProps>`
  display: flex;
  flex-direction: column;
  margin: ${({ theme }) => theme.spacing.large}px;
  justify-content: center;
  align-content: center;
`;

export const P = styled.p`
  ${(props) => ({ ...props.theme.typography.body })};
  color: ${(props) => props.theme.palette.text};
`;

export const H2 = styled(P)`
  ${(props) => ({ ...props.theme.typography.h2 })};
  margin-bottom: ${({ theme }) => theme.spacing.normal}px;
`;

export const H3 = styled(P)`
  ${(props) => ({ ...props.theme.typography.h3 })};
  margin-bottom: ${({ theme }) => theme.spacing.large}px;
`;
