/**
 * @file Dynasty, asynchronous dependency injection.
 * @author Adam Mill <hismajesty@theroyalwhee.com>
 * @copyright Copyright 2019-2021 Adam Mill
 * @license Apache-2.0
 */

/**
 * Collect Function factory.
 *
 * @returns {Function} The collect function.
 */
function collectFactory() {
  /**
   * Collect all attached dependencies into an object that becomes this item's value.
   * This is a builder function.
   * @public
   * @typedef collect
   * @function
   * @returns {promise<function>} The resulting parameter function.
   */
  return function collect() {
    function collectParam(item) {
      item.creator = (dyn) => {
        const collected = Object.assign({}, dyn());
        return Promise.resolve(collected);
      };
      return Promise.resolve(item);
    };
    return Promise.resolve(collectParam);
  };
}

/**
 * Exports.
 */
module.exports = { collectFactory };
