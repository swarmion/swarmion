/**
 * A helper type used to remove undefined keys from an interface
 *
 * For example:
 *
 * ```
 * interface A {
 *    foo: string;
 *    bar: undefined;
 * }
 *
 * type B = DefinedProperties<A>
 * ```
 *
 * then B is:
 * ```
 * {
 *    foo: string;
 * }
 * ```
 */
export type DefinedProperties<Type> = {
  [Property in keyof Type as Type[Property] extends undefined
    ? never
    : Property]: Type[Property];
};
