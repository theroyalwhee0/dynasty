/**
 * @file Dynasty, asynchronous dependency injection.
 * @author Adam Mill <hismajesty@theroyalwhee.com>
 * @copyright Copyright 2019-2021 Adam Mill
 * @license Apache-2.0
 */

/**
 * Imports.
 *
 */
const mergeWith = require('lodash.mergewith');
const { getTypeOf, isArray, isObject, isFunction } = require('@theroyalwhee0/istype');

/**
 * Config Function factory.
 *
 * @returns {Function} The config function.
 */
function configFactory(context) {

  /**
   * Deep merge configuration into existing configuration.
   * @param {object} config Configuration to merge.
   */
  function mergeConfig(config) {
    mergeWith(context.config, config, (obj, src) => {
      if(isArray(obj) && isArray(src)) {
        return obj.concat(src);
      }
    });
  }

  /**
   * Merge an object into the configuration.
   * This configuration is exposed to builder functions.
   * @typedef coreConfig
   * @function
   * @param {object|function} value Object to merge into the configuration. If function merge the results of the function.   * @returns {promise} No results.
   */
  function coreConfig(value) {
    if(isObject(value)) {
      mergeConfig(value);
      return Promise.resolve();
    } else if(isFunction(value)) {
      return new Promise(async (resolve) => {
        const config = await value();
        mergeConfig(config);
        resolve();
      });
    } else {
      throw new Error(`Invalid config type '${getTypeOf(value)}'`);
    }
  }

  /**
   * Merge an object into the configuration.
   * This configuration is exposed to builder functions.
   * @public
   * @typedef config
   * @function
   * @param {object|function} value Object to merge into the configuration. If function merge the results of the function.
   * @returns {promise} No results.
   */
  return function config(value) {
    const promise = coreConfig(value);
    // NOTE: Because the user does not have to chain the config's promises we need to
    // keep track of them so we can catch rejections and resolve everything later.
    context.actions.config.push(promise);
    return promise;

  };
}

/**
 * Exports.
 */
module.exports = {
  configFactory,
};
