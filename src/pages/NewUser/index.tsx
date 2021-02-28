import React, { FC } from 'react';
import { Header, SignInForm } from '../../components';
import { BackgroundImg, Content, HeaderContainer, Page } from './styles';

export const NewUser: FC = () => {
  return (
    <Page>
      <BackgroundImg />
      <HeaderContainer>
        <Header />
      </HeaderContainer>
      <Content>
        <SignInForm />
      </Content>
    </Page>
  );
};
