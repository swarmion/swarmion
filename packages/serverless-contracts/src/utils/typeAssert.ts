// @ts-expect-error we want to define this type argument without using it
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const typeAssert = <T extends 1>(): undefined => undefined;
