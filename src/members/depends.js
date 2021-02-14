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
 * Depends Function factory.
 * @returns {Function} The depends function.
 */
function dependsFactory() {
  /**
   * Add dependencies to the item.
   * @public
   * @typedef depends
   * @function
   * @param {...(string|object)} deps Items to make dependencies of this item.
   * @returns {promise<function>} The resulting parameter function.
   */
  return function depends(...deps) {
    deps = transformDeps(deps);
    function dependsParam(item) {
      item.depends = Object.assign(item.depends || { }, deps);
      return Promise.resolve(item);
    };
    return Promise.resolve(dependsParam);
  };
}

/**
 * Exports.
 */
module.exports = {
  dependsFactory,
};
