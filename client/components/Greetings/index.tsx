import React from 'react';

import { Container, Image, Text } from './styles';
import Button from '../Button';

const Greetings: React.FC = () => {
  return (
    <Container>
      <Image
        src="https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg"
        alt="ReactJS logo"
      />
      <Text>
        An Electron boilerplate including TypeScript, React, Jest and ESLint.
      </Text>
      <Button>I am the button</Button>
    </Container>
  );
};

export default Greetings;