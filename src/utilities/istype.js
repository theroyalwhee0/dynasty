/**
 * @theroyalwhee0/dynasty:src/utilities/istype.js
 */

/**
 * Is Array?
 */
const { isArray } = Array;

/**
 * Is Object?
 * Opinionated, arrays are not objects.
 */
function isObject(value) {
  return !!(
    value &&
        typeof value === 'object' &&
        !isArray(value)
  );
}

/**
 * Is Function?
 */
function isFunction(value) {
  return typeof value === 'function';
}

/**
 * Can the type have members?
 */
function canHaveMembers(value) {
  return isObject(value) || isArray(value) || isFunction(value);
}

/**
 * Exports.
 */
module.exports = {
  isArray, isObject, isFunction, canHaveMembers,
};
