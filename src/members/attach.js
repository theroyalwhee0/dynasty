/**
 * @file Dynasty, asynchronous dependency injection.
 * @author Adam Mill <hismajesty@theroyalwhee.com>
 * @copyright Copyright 2019-2021 Adam Mill
 * @license Apache-2.0
 */

/**
 * Imports.
 */
const { transformDeps } = require('../depends');

/**
 * Attach Function factory.
 * @returns {Function} The attach function.
 */
function attachFactory() {
  /**
   * Attach and expose dependencies to the item.
   * @public
   * @typedef attach
   * @function
   * @param {...(string|object)} deps Any parameters to use as arguments to the item.
   * @returns {promise<function>} The resulting parameter function.
   */
  return function attach(...deps) {
    deps = transformDeps(deps);
    function attachParam(item) {
      item.attach = Object.assign(item.attach || { }, deps);
      return Promise.resolve(item);
    };
    return Promise.resolve(attachParam);
  };
}

/**
 * Exports.
 */
module.exports = {
  attachFactory,
};
