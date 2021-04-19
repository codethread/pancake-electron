import React from 'react';

import TestIds from '@shared/testids';
import { Container, Image } from './styles';
import { Button } from '../Button';

const Greetings: React.FC = () => (
  <Container data-testid={TestIds.GREETING_MESSAGE}>
    <Image
      src="https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg"
      alt="ReactJS logo"
    />
    <Button>Test Button</Button>
  </Container>
);

export default Greetings;
