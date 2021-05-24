/* eslint-disable react/jsx-props-no-spreading */
import React, { FC } from 'react';
import styled from 'styled-components';
import { isTest } from '@shared/constants';

const borderW = '1px';
const borderR = 20;
export const Container = styled.div`
  margin: ${({ theme }) => theme.spacing.large}px;
  max-width: 450px;
  background-color: ${(props) => props.theme.palette.glass};
  border-radius: ${borderR}px;
  display: grid;
  grid-template-rows: ${borderR}px auto ${borderR}px;
  grid-template-columns: ${borderR}px auto ${borderR}px;
  grid-template-areas:
    'tl t tr'
    'l content r'
    'bl b br';

  backdrop-filter: blur(10px);
`;

const Content = styled.div`
  grid-area: content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  padding: ${({ theme }) => theme.spacing.large}px;
  color: ${(props) => props.theme.palette.white};
`;

const Corner = styled.div<ICorner>`
  overflow: hidden;
  grid-area: ${(props) => props.gridArea};
`;

const Border = styled.div<ICorner>`
  box-sizing: border-box;
  position: relative;
  width: 200%;
  height: 200%;
  border-radius: 20px;
  border: ${borderW} solid ${(props) => props.color};
  top: ${(props) => props.top}%;
  left: ${(props) => props.left}%;
`;

interface ICorner {
  gridArea: 'bl' | 'br' | 'tl' | 'tr';
  left: number;
  top: number;
  color: string;
}

const light = '#FFFBFB';
const middle = 'rgba(163, 204, 207, 0.1)';
const dark = '#429BA0';

const lightToMiddle = (deg: number): string => `linear-gradient(${deg}deg, ${light}, ${middle}) 1`;
const middleToDark = (deg: number): string => `linear-gradient(${deg}deg, ${middle}, ${dark}) 1`;

const corners: ICorner[] = [
  { gridArea: 'tl', top: 0, left: 0, color: light },
  { gridArea: 'tr', top: 0, left: -100, color: middle },
  { gridArea: 'bl', top: -100, left: 0, color: middle },
  { gridArea: 'br', top: -100, left: -100, color: dark },
];

const GlassStub: FC = ({ children }) => <div>{children}</div>;
const GlassComp: FC = ({ children }) => (
  <Container>
    {corners.map((corner) => (
      <Corner key={corner.gridArea} {...corner}>
        <Border {...corner} />
      </Corner>
    ))}
    <span
      style={{
        gridArea: 't',
        borderTop: `${borderW} solid ${dark}`,
        borderImage: lightToMiddle(90),
      }}
    />
    <span
      style={{
        gridArea: 'l',
        borderLeft: `${borderW} solid`,
        borderImage: lightToMiddle(180),
      }}
    />
    <span
      style={{
        gridArea: 'r',
        borderRight: `${borderW} solid`,
        borderImage: middleToDark(180),
      }}
    />
    <span
      style={{
        gridArea: 'b',
        borderBottom: `${borderW} solid`,
        borderImage: middleToDark(90),
      }}
    />
    <Content>{children}</Content>
  </Container>
);

export const Glass = isTest ? GlassStub : GlassComp;
