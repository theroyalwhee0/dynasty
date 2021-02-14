/**
 * @file Dynasty, asynchronous dependency injection.
 * @author Adam Mill <hismajesty@theroyalwhee.com>
 * @copyright Copyright 2019-2021 Adam Mill
 * @license Apache-2.0
 */

/**
 * Args Function factory.
 *
 * @returns {Function} The args function.
 */
function argsFactory() {
  /**
   * Add arguments to the item builder.
   * @public
   * @typedef args
   * @function
   * @param {...any} arguments Any parameters to use as arguments to the item.
   * @returns {promise<function>} The resulting parameter function.
   */
  return function args(...argList) {
    function argsParam(item) {
      item.args = (item.args || [ ]).concat(argList);
      return Promise.resolve(item);
    };
    return Promise.resolve(argsParam);
  };
}

/**
 * Exports.
 */
module.exports = {
  argsFactory,
};
