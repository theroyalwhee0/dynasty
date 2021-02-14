/**
 * @file Dynasty, asynchronous dependency injection.
 * @author Adam Mill <hismajesty@theroyalwhee.com>
 * @copyright Copyright 2019-2021 Adam Mill
 * @license Apache-2.0
 */

/**
 * Extend Function factory.
 * @returns {Function} The extend function.
 */
function extendFactory() {
  /**
   * Attach values directly to the item.
   * @public
   * @typedef extend
   * @function
   * @param {object<string,any>} props Any values by key.
   * @returns {promise<function>} The resulting parameter function.
   */
  return function extend(props) {
    function extendParam(item) {
      item.extend = Object.assign(item.extend || { }, props);
      return Promise.resolve(item);
    };
    return Promise.resolve(extendParam);
  };
}

/**
 * Exports.
 */
module.exports = {
  extendFactory,
};
