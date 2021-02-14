/**
 * @file Dynasty, asynchronous dependency injection.
 * @author Adam Mill <hismajesty@theroyalwhee.com>
 * @copyright Copyright 2019-2021 Adam Mill
 * @license Apache-2.0
 */

/**
 * Entrypoint Function factory.
 * @returns {Function} The depends function.
 */
function entryPointFactory(context) {
  /**
   * Specify an entry point for the Dynasty collection.
   * There may be multiple entry points.
   * This is a builder function.
   * @public
   * @typedef entryPoint
   * @function
   * @returns {promise<function>} The resulting parameter function.
   */
  return async function entryPoint() {
    return function entryPointParam(item) {
      item.creator = () => {
        return Promise.resolve(undefined);
      };
      context.entryPoints.push(item);
      return item;
    };
  };
}

/**
 * Exports.
 */
module.exports = {
  entryPointFactory,
};
