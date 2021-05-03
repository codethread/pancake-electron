import { mocked } from 'ts-jest/utils';
import { render, screen } from '@test/rtl';
import React from 'react';
import * as _constants from '@shared/constants';
import TestIds from '@shared/testids';
import { NullComp } from '@client/components';

jest.mock('@shared/constants');

const constants = mocked(_constants);

describe('NullComp', () => {
  beforeEach(() => {
    render(<NullComp />);
  });

  describe('in tests', () => {
    beforeAll(() => {
      constants.isTest = true;
    });

    it('returns an empty span to assert on', () => {
      expect(screen.getByTestId(TestIds.NULL_COMP)).toBeInTheDocument();
    });
  });

  describe('not in tests', () => {
    beforeAll(() => {
      constants.isTest = false;
    });

    it('returns null', () => {
      expect(screen.queryByTestId(TestIds.NULL_COMP)).not.toBeInTheDocument();
    });
  });
});
