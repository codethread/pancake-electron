import styled from 'styled-components';

export const LoginPage = styled.div`
  display: flex;
  justify-content: left;
  flex-direction: column;
  align-items: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    flex-direction: row;
    justify-content: center;
  }
`;
