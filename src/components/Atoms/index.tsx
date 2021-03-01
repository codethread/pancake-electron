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

interface TextProps {
  align?: 'left' | 'right' | 'center' | 'justify';
}

export const P = styled.p<TextProps>`
  ${(props) => ({ ...props.theme.typography.body })};
  line-height: ${({ theme }) => theme.typography.body.lineHeight}rem;
  margin-bottom: ${({ theme }) => theme.typography.body.marginBottom}rem;
  text-align: ${(props) => props.align || 'inherit'};
  color: ${(props) => props.theme.palette.white};
`;

export const H2 = styled(P)`
  ${(props) => ({ ...props.theme.typography.h2 })};
  line-height: ${({ theme }) => theme.typography.h2.lineHeight}rem;
  margin-bottom: ${({ theme }) => theme.typography.h2.marginBottom}rem;
`;

export const H3 = styled(P)`
  ${(props) => ({ ...props.theme.typography.h3 })};
  line-height: ${({ theme }) => theme.typography.h3.lineHeight}rem;
  margin-bottom: ${({ theme }) => theme.typography.h3.marginBottom}rem;
  color: ${({ theme }) => theme.palette.grey};
`;
