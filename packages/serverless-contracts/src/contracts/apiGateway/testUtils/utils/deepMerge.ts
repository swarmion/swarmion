/**
 * TODO: investigate why using a named export of `merge` does not work when the lib is consumed
 * this is not really a problem, since this code will only be used in tests
 */
// eslint-disable-next-line no-restricted-imports
import _ from 'lodash';

export const deepMerge = <LEFT, RIGHT>(
  left: LEFT,
  right: RIGHT,
): LEFT & RIGHT => _.mergeWith(left, right, keepUnchangedRefsOnly);

// This method allow us to merge objects while keeping the undefined values coming from the right object
// https://stackoverflow.com/questions/22581220/lodash-merge-including-undefined-values/22581862#22581862
const keepUnchangedRefsOnly = (
  objValue: unknown,
  srcValue: unknown,
): unknown => {
  if (_.isPlainObject(objValue)) {
    return _.assignWith({}, objValue, srcValue, keepUnchangedRefsOnly);
  }

  return undefined;
};
