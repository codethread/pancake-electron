// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type,@typescript-eslint/no-explicit-any
export function createMockFn<A extends (...args: any[]) => any>() {
  return jest.fn<ReturnType<A>, Parameters<A>>();
}
