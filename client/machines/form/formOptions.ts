import { assign } from 'xstate';
import { Partial2Deep } from '@shared/types';
import merge from 'lodash.merge';
import { FormOptions } from '@client/machines/form/formMachine';

const formOptionsDefaults: FormOptions = {
  guards: {
    isGithubToken: ({ errors }) => errors.length === 0,
    isCleared: (c) => c.text === '',
  },
  actions: {
    storeInput: assign({
      text: (c, e) => (e.type === 'ENTER_INPUT' ? e.text : c.text),
      errors: (c, e) => {
        if (e.type !== 'ENTER_INPUT') return c.errors;

        const errors: string[] = [];

        if (e.text.length < 40) {
          errors.push('at least 40 characters required');
        }

        if (/[^\w]/.test(e.text)) {
          errors.push('only alpha numeric characters and "_"');
        }

        return errors;
      },
    }),
    submitValidToken: () => {
      throw new Error('action expects to be overridden in use');
    },
  },
};

export const formOptions = (overrides: Partial2Deep<FormOptions>): FormOptions =>
  merge({}, formOptionsDefaults, overrides);
