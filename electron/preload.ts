// eslint-disable-next-line import/no-extraneous-dependencies
import { contextBridge, ipcRenderer } from 'electron';
import type { IBridge } from '@shared/IBridge';
import { isIntegration } from '@shared/constants';

const bridge: IBridge = {
  test: () => {
    ipcRenderer.send('bridge', 'test message');
  },
};

/**
 * Integration is required for e2e testing with Spectron
 *
 * the contextBridge prevents the client access `require` which is desirable in most situations
 * however spectron needs access to the `remote` module via `require`, so we have to
 * bypass this security feature for this scenario
 */
if (isIntegration) {
  // this mimics the behaviour of the context bridge to keep behaviour as prod-like as possible
  deepFreeze(bridge);

  window.bridge = bridge;

  // eval('require') here stops webpack trying to work out what's being imported
  // this removes some warnings and prevents `require` becoming webpack's own
  // `_webpack_require`, which seemed to keep failing

  // @ts-expect-error just for spectron to have access to running electron
  // eslint-disable-next-line no-eval,@typescript-eslint/no-unsafe-assignment
  window.electronRequire = eval('require');
} else {
  contextBridge.exposeInMainWorld('bridge', bridge);
}
/**
 * Recursively Object.freeze() on objects and functions
 * @see https://github.com/substack/deep-freeze
 * @param o Object on which to lock the attributes
 */
function deepFreeze<T extends Record<string, any>>(o: T): Readonly<T> { // eslint-disable-line
  Object.freeze(o);

  Object.getOwnPropertyNames(o).forEach((prop) => {
    if (
      // eslint-disable-next-line no-prototype-builtins
      o.hasOwnProperty(prop) &&
      o[prop] !== null &&
      (typeof o[prop] === 'object' || typeof o[prop] === 'function') &&
      !Object.isFrozen(o[prop])
    ) {
      deepFreeze(o[prop]);
    }
  });

  return o;
}
