import React from 'react';
import pj from 'package.json';

import { Container, Image, Text } from './styles';
import { Button } from '../Button';

const Greetings: React.FC = () => (
  <Container>
    <Image
      src="https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg"
      alt="ReactJS logo"
    />
    <Text>Welcome to version {pj.version}</Text>
    <Button>Test Button</Button>
  </Container>
);

export default Greetings;
