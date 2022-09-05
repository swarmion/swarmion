/**
 * extract a type from an array of types.
 * See https://stackoverflow.com/questions/43537520/how-do-i-extract-a-type-from-an-array-in-typescript/52331580
 *
 **/
export type Unpacked<T> = T extends (infer U)[] ? U : T;

/**
 * transform an object into Record<string, never> if it is {}
 */
export type CleanEmptyObject<T extends object> = keyof T extends never
  ? Record<string, never>
  : T;
