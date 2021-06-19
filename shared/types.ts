import { ElectronLog } from 'electron-log';
import { Result } from '@shared/Result';
import { _User } from '@shared/graphql';

export interface ILogger extends ElectronLog {
  errorWithContext(context: string): (err: Error | string) => void;
  info(...msg: string[]): void;
  error(...msg: string[]): void;
}

export type IClientLogger = Pick<ILogger, 'error' | 'info'>;

export interface UserStore {
  filters: [];
  user?: _User;
}

// TODO create a type to encapsulate this
// All methods must return void or Result type
export interface IBridge extends IClientLogger {
  openGithubForTokenSetup(): void;
  test(...msg: string[]): void;
  validateAndStoreGithubToken(...token: string[]): Promise<Result<boolean>>;
  getCurrentUser(...token: string[]): Promise<Result<_User>>;
  loadUserConfig(): Promise<Result<UserStore>>;
}

export type Partial2Deep<T> = {
  [P in keyof T]?: Partial<T[P]>;
};

// interface None<A> {
//   map: <B>(f: (m: A) => B) => None<A>;
//   get: (fallback: A) => A;
// }
//
// interface Some<A> {
//   map: <B>(f: (m: A) => B) => Some<B>;
//   get: (fallback: A) => A;
// }
//
// export function some<A>(val: A): Some<A> {
//   return {
//     get: () => val,
//     map: (fn) => some(fn(val)),
//   };
// }
//
// type Maybe<A> = None<A> | Some<A>;

export interface AnyObject {
  [key: string]: any;
}
