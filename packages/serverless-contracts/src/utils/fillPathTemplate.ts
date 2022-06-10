/**
 * Fills a string template with values.
 *
 * The keys to be replaced must be passed in `{}` in the template. For example `"/users/{userId}"`";
 * The key name must match the one passed in the curly braces
 *
 *
 * @param template the template to be fill;
 * @param values the values to fill;
 * @returns the filled template.
 */
export const fillPathTemplate = (
  template: string,
  values?: Record<string, string>,
): string =>
  values === undefined
    ? template
    : Object.entries(values).reduce((accumulator, [key, value]) => {
        const re = new RegExp(`{${key}}`, 'g');

        return accumulator.replace(re, value);
      }, template);
