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
const { isArray, isObject } = require('@theroyalwhee0/istype');

/**
 * Config Function factory.
 *
 * @returns {Function} The config function.
 */
function configFactory(context) {
  /**
   * Merge an object into the configuration.
   * This configuration is exposed to builder functions.
   * @public
   * @typedef config
   * @function
   * @params {object} Object to merge into the configuration.
   * @returns {promise} No results.
   */
  return function config(value) {
    if(isObject(value)) {
      mergeWith(context.config, value, (obj, src) => {
        if(isArray(obj) && isArray(src)) {
          return obj.concat(src);
        }
      });
    }
    return Promise.resolve();
  };
}

/**
 * Exports.
 */
module.exports = {
  configFactory,
};
