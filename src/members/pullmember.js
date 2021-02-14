/**
 * @file Dynasty, asynchronous dependency injection.
 * @author Adam Mill <hismajesty@theroyalwhee.com>
 * @copyright Copyright 2019-2021 Adam Mill
 * @license Apache-2.0
 */

/**
 * Imports.
 */
const { isFunction, canHaveMembers } = require('@theroyalwhee0/istype');

/**
 * Pull Member Function factory.
 * @returns {Function} The pullMember function.
 */
function pullMemberFactory() {
  /**
   * Get a member property from an attached dependency and use it as this item.
   * This is a builder function.
   * @public
   * @typedef pullMember
   * @function
   * @param {string} name The attached dependency to pull from.
   * @param {string} member The member property name to pull.
   * @param {object} options Options.
   * @param {boolean} options.bind If the property is a function bind to parent. Defaults to true.
   * @returns {promise<function>} The resulting parameter function.
   */
  return function pullMember(name, member, { bind=true }={}) {
    function pullMemberParam(item) {
      item.creator = (dyn) => {
        const attached = dyn();
        if(!(name in attached)) {
          return Promise.reject(new Error(`node "${name}" not attached`));
        }
        const item = attached[name];
        if(!canHaveMembers(item)) {
          return Promise.reject(new Error(`node "${name}" can not have members`));
        }
        if(!(member in item)) {
          return Promise.reject(new Error(`node "${name}" does not have a member "${member}"`));
        }
        const property = item[member];
        let results;
        if(bind && isFunction(property)) {
          // If it is a function then bind it.
          results = property.bind(item);
        } else {
          results = property;
        }
        return Promise.resolve(results);
      };
      return Promise.resolve(item);
    };
    return Promise.resolve(pullMemberParam);
  };
}

/**
 * Exports.
 */
module.exports = { pullMemberFactory };
