import React, { FC, useEffect } from 'react';
import { useStore } from '../../hooks';
import { Button } from '../Button';
import { Box } from '../Atoms';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;

  background: ${(props) => props.theme.palette.gradients.masthead(-90)};

  @media (min-width: ${(props) => props.theme.breakpoints.sm}px) {
    flex-direction: column;
    background: ${(props) => props.theme.palette.gradients.masthead(180)};
  }
`;

const Menu = styled.div`
  display: flex;
  justify-content: space-between;
`;

const width = 45;

const Img = styled.img`
  width: ${width}px;
  border-radius: ${width / 2}px;
`;

export const Header: FC = () => {
  const {
    store,
    fetch: { logout, getUser },
  } = useStore();

  useEffect(() => {
    if (store.loggedIn) getUser().catch(console.error);
  }, [store.loggedIn]);

  return (
    <HeaderContainer>
      <Box>Pancake</Box>
      <Menu>
        {store.user && (
          <Box>
            <Img
              src={store.user.viewer.avatarUrl}
              alt={store.user.viewer.name}
            />
          </Box>
        )}
        {store.loggedIn && (
          <Box>
            <Button
              onClick={() => {
                logout().catch(console.error);
              }}
            >
              Log out
            </Button>
          </Box>
        )}
      </Menu>
    </HeaderContainer>
  );
};
