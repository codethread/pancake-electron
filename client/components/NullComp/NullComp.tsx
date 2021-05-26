import React, { FC } from 'react';
import { isTest } from '@shared/constants';
import TestIds from '@shared/testids';

export const NullComp: FC = () => (isTest ? <span data-testid={TestIds.NULL_COMP} /> : null);
