/**
 * @theroyalwhee0/dynasty:src/members/add.js
 */

/**
 * Imports.
 */
const { isString, isFunction } = require('@theroyalwhee0/istype');

/**
 * Item factory.
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
 * Add factory.
 * NOTE: Because the user does not have to chain the add's promises we need to
 * keep track of them so we can catch rejections and resolve everything later.
 */
function addFactory(context) {
  return function add(name, ...props) {
    const promise = addCore(context, name, props);
    context.actions.push(promise);
    return promise;
  };
}

/**
 * Exports.
 */
module.exports = addFactory;
