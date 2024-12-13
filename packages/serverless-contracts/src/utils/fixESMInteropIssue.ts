// Esbuild wrap the require of some dependencies with __toESM
// Because this lib is of type module, __toESM put the required module into a default attribute
// https://github.com/egoist/tsup/issues/658
// https://github.com/evanw/esbuild/issues/2023
// Some librairie have already made this default export transformation and it causes a double default export which breaks the code.
// This function is a workaround to fix this issue.
// Other workarounds are
// - use splitting option of Tsup wich use splitting feature of esbuild. The __toESM is replace with another interop function which doesn't add another default if it has already be done. But this seems to be a side effect of esbuild splitting which is explicitly not compatible with cjs. => I decided not to use it.
// - Some libs affect the default export directly to the exports object. The behavior of __toESM doesn't break because it only add one default. => In our cas some library can't be modified because they now are in full ESM and don't support cjs anymore.
export const fixESMInteropIssue = <T>(object: T): T => {
  // @ts-expect-error typescript can't knwow that a double default have been added by esbuild through tsup
  if (object && object.default) {
    // @ts-expect-error typescript can't knwow that a double default have been added by esbuild through tsup
    return object.default as T;
  }

  return object;
};
