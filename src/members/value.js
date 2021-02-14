/**
 * @file Dynasty, asynchronous dependency injection.
 * @author Adam Mill <hismajesty@theroyalwhee.com>
 * @copyright Copyright 2019-2021 Adam Mill
 * @license Apache-2.0
 */

/**
 * Value Function factory.
 * @returns {Function} The value function.
 */
function valueFactory() {
  /**
   * Supply a value to be used as this item.
   * This is a builder function.
   * @public
   * @typedef value
   * @function
   * @param {any} contents The value to use.
   * @returns {promise<function>} The resulting parameter function.
   */
  return async function value(contents) {
    if(arguments.length === 0) {
      throw new Error('"contents" is required');
    }
    return function valueParam(item) {
      item.creator = async () => {
        if(item.args && item.args.length > 0) {
          throw new Error('"value" creator does not support "args" property.');
        }
        return contents;
      };
      return item;
    };
  };
}

/**
 * Exports.
 */
module.exports = {
  valueFactory,
};
