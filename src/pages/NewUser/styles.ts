import styled from 'styled-components';
import bg from '../../../designAssets/76.-Rice-Flower_1.jpg';

export const Page = styled.div`
  height: 100vh;
  display: grid;

  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'header'
    'main';

  @media (min-width: ${(props) => props.theme.breakpoints.sm}px) {
    grid-template-columns: auto 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: 'header main';
  }
`;

export const headerHeight = 85;

export const HeaderContainer = styled.div`
  grid-area: header;
  height: ${headerHeight}px;
  z-index: ${(props) => props.theme.zIndex.header};

  @media (min-width: ${(props) => props.theme.breakpoints.sm}px) {
    height: auto;
    width: ${headerHeight}px;
  }
`;

export const Content = styled.div`
  grid-area: main;
  overflow: auto;
`;

export const BackgroundImg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: ${({ theme }) => theme.zIndex.background};

  background: ${(props) => props.theme.palette.gradients.background(-45)};

  @media (min-width: ${(props) => props.theme.breakpoints.sm}px) {
    background: ${(props) => props.theme.palette.gradients.background()};
  }
  // background-image: url(${bg});
  // background-position: center;
  // background-repeat: no-repeat;
  // background-size: 100% 100%;
`;
