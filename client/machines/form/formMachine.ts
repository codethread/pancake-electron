// eslint-disable-next-line import/no-extraneous-dependencies
import { createMachine, StateWithMatches } from '@xstate/compiled';
import { assign } from 'xstate';
import merge from 'lodash.merge';
import { Partial2Deep } from '@shared/types';
import { MachineOptions } from '../utils';

interface FormContext {
  text: string;
  errors: string[];
}

type FormEvent = { type: 'ENTER_INPUT'; text: string } | { type: 'SUBMIT' };

export type FormOptions = MachineOptions<FormContext, FormEvent, 'form'>;
export type FormState = StateWithMatches<FormContext, FormEvent, 'form'>;

const formOptionsDefaults: FormOptions = {
  guards: {
    isGithubToken: ({ errors }) => errors.length === 0,
    isCleared: (c) => c.text === '',
  },
  actions: {
    storeInput: assign({
      text: (c, e) => (e.type === 'ENTER_INPUT' ? e.text : c.text),
      errors: (c, e) => {
        if (e.type === 'ENTER_INPUT') {
          const errors: string[] = [];

          if (e.text.length < 40) {
            errors.push('at least 40 characters required');
          }

          if (/[^\w]/.test(e.text)) {
            errors.push('only alpha numeric characters and "_"');
          }

          return errors;
        }
        return c.errors;
      },
    }),
    submitValidToken: () => {
      throw new Error('action not implemented');
    },
  },
};

export const formOptions = (overrides: Partial2Deep<FormOptions>): FormOptions =>
  merge({}, formOptionsDefaults, overrides);

export const formMachine = createMachine<FormContext, FormEvent, 'form'>({
  id: 'formMachine',
  context: {
    text: '',
    errors: [],
  },
  initial: 'entering',
  states: {
    entering: {
      onEntry: 'storeInput',
      on: {
        ENTER_INPUT: 'entering',
        SUBMIT: [
          {
            cond: 'isGithubToken',
            actions: 'submitValidToken',
          },
          {
            target: 'invalid',
          },
        ],
      },
    },
    invalid: {
      onEntry: 'storeInput',
      always: [
        { cond: 'isCleared', target: 'entering' },
        { cond: 'isGithubToken', target: 'entering' },
      ],
      on: {
        ENTER_INPUT: 'invalid',
      },
    },
  },
});
