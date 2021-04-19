import React, { FC } from 'react';
import TestIds from '@shared/testids';
import pj from 'package.json';

export const Navigation: FC = () => (
  <div data-testid={TestIds.NAVIGATION}>{pj.version}</div>
);
