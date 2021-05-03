import React, { FC } from 'react';
import pj from 'package.json';
import TestIds from '@shared/testids';
import { IBridge } from '@shared/types';

interface INavigation {
  /**
   * bridge for testing
   * only passed in for testing
   */
  bridge?: IBridge;
}

export const Navigation: FC<INavigation> = ({ bridge = window.bridge }) => (
  <button
    data-testid={TestIds.NAVIGATION}
    aria-hidden="true"
    type="button"
    onClick={() => {
      bridge.test('test bridge message');
    }}
  >
    {pj.version}
  </button>
);
