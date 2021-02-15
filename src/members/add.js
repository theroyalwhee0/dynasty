/**
 * @file Dynasty, asynchronous dependency injection.
 * @author Adam Mill <hismajesty@theroyalwhee.com>
 * @copyright Copyright 2019-2021 Adam Mill
 * @license Apache-2.0
 */

/**
 * Imports.
 */
const { isString, isFunction } = require('@theroyalwhee0/istype');

/**
 * Item factory.
 *
 * @param The initial values to add to the factory.
 * @returns {object} The item that was created.
 */
function itemFactory(initial) {
  const values = {
    ...initial,
  };
  const item = {
    get name() {
      return values.name;
    },
    get creator() {
      return values.creator;
    },
    set creator(creator) {
      if('creator' in values) {
        throw new Error(`"creator" already attached to node`);
      }
      values.creator = creator;
    },
  };
  return item;
}

/**
 * Core add, wrapped by addFactory.
 *
 * @param {Object} context The shared Dynasty context.
 * @param {string} name The name of the item.
 * @param {promise<array<function>>} props An array of property functions to apply to this item.
 * @returns {promise} No results.
 */
async function addCore(context, name, props) {
  const { items } = context;
  if(!isString(name)) {
    return Promise.reject(new Error('"name" must be a string'));
  } else if(name in items) {
    return Promise.reject(new Error(`item named "${name}" already added`));
  }
  items[name] = true; // Placeholder value to indicate this is being added.
  let item = itemFactory({ name });
  for(let prop of props) {
    const modifier = await prop;
    item = await modifier(item);
    if(!item) {
      throw new Error(`modifier "${modifier}" returned nothing in "${name}"`);
    }
  }
  if(!isFunction(item.creator)) {
    return Promise.reject(new Error(`item named "${name}" missing a creator`));
  }
  items[name] = item;
};

/**
 * Add Function factory.
 * @param {Object} The shared Dynasty context.
 * @returns {Function} The add function.
 */
function addFactory(context) {
  /**
   * Add a named item to the Dynasty collection.
   * @public
   * @typedef add
   * @function
   * @param {string} name The name of the item.
   * @param {...Function} prop Various property functions to apply to this item.
   * @returns {promise} No results.
   */
  return function add(name, ...props) {
    const promise = addCore(context, name, props);
    // NOTE: Because the user does not have to chain the add's promises we need to
    // keep track of them so we can catch rejections and resolve everything later.
    context.actions.add.push(promise);
    return promise;
  };
}

/**
 * Exports.
 */
module.exports = {
  addFactory,
};
