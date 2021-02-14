/**
 * @file Dynasty, asynchronous dependency injection.
 * @author Adam Mill <hismajesty@theroyalwhee.com>
 * @copyright Copyright 2019-2021 Adam Mill
 * @license Apache-2.0
 */

/**
 * Imports.
 */
const { isFunction } = require('@theroyalwhee0/istype');

/**
 * Call Function factory.
 * @returns {Function} The call function.
 */
function callFactory() {
  /**
   * Call a factory function whenever an instance of this object is needed.
   * This is a builder function.
   * @public
   * @typedef call
   * @function
   * @param {function} builder The factory function to call.
   * @returns {promise<function>} The resulting parameter function.
   */
  return function call(builder) {
    if(!isFunction(builder)) {
      return Promise.reject(new Error(`"builder" should be a function: ${builder} (${typeof builder})`));
    }
    function callParam(item) {
      item.creator = (dyn) => {
        const args = item.args || [ ];
        const results = builder(...args, dyn);
        return Promise.resolve(results);
      };
      return Promise.resolve(item);
    };
    return Promise.resolve(callParam);
  };
}

/**
 * Exports.
 */
module.exports = {
  callFactory,
};
