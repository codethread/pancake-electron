import React, { FC } from 'react';
import pj from 'package.json';
import TestIds from '@shared/testids';

export const Navigation: FC = () => (
  <div data-testid={TestIds.NAVIGATION}>{pj.version}</div>
);
