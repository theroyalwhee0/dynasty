/**
 * @file Dynasty, asynchronous dependency injection.
 * @author Adam Mill <hismajesty@theroyalwhee.com>
 * @copyright Copyright 2019-2021 Adam Mill
 * @license Apache-2.0
 */

/**
 * Imports.
 */
const UNSET = require('../unset');
const { isFunction } = require('@theroyalwhee0/istype');

/**
 * Once Function factory.
 * @returns {Function} The once function.
 */
function onceFactory() {
  /**
   * Call a factory function once. Additional calls will return the original value.
   * This is a builder function.
   * @public
   * @typedef once
   * @function
   * @param {function} builder The factory function to call.
   * @returns {promise<function>} The resulting parameter function.
   */
  return async function once(builder) {
    if(!isFunction(builder)) {
      throw new Error(`"builder" should be a function: "${builder}" (${typeof builder})`);
    }
    return function onceParam(item) {
      let result = UNSET;
      item.creator = (dyn) => {
        if(result === UNSET) {
          const args = item.args || [ ];
          try {
            result = Promise.resolve(builder(...args, dyn));
          } catch(ex) {
            result = Promise.reject(ex);
          }
        }
        return result;
      };
      return item;
    };
  };
}

/**
 * Exports.
 */
module.exports = { onceFactory };
