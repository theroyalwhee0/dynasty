/**
 * @theroyalwhee0/dynasty:src/items.js
 */

/**
 * Imports.
 */
const { allProps } = require('@theroyalwhee0/please');
const { getDirectDependenciesOf } = require('./depends');
const { isObject } = require('./utilities/istype');

/**
 * Resolve Dependent Items.
 */
async function resolveDepItems(name, depGraph, getItemFromGraph) {
  const names = getDirectDependenciesOf(depGraph, name);
  const deps = { };
  for(let depName of names) {
    const dep = getItemFromGraph(depName, depGraph);
    deps[depName] = dep;
  }
  return allProps(deps);
};

/**
 * Get an item from the dependency tree.
 */
async function getItem(name, depGraph, context) {
  const { items } = context;
  const item = items[name];
  if(item === undefined) {
    return Promise.reject(new Error(`No item found with name of "${name}"`));
  } else {
    const names = getDirectDependenciesOf(depGraph, name);
    const deps = { };
    for(let depName of names) {
      const dep = getItem(depName, depGraph, context);
      deps[depName] = dep;
    }
    const depItems = await allProps(deps);
    const attachedItems = Object.assign({ }, item.extend);
    if(item.attach) {
      const injectedKeys = Object.keys(item.attach);
      for(let loop=0; loop < injectedKeys.length; loop++) {
        const key = injectedKeys[loop];
        const attachAs = item.attach[key];
        attachedItems[attachAs] = depItems[key];
      }
    }
    function dyn(obj) {
      if(isObject(obj)) {
        Object.assign(obj, attachedItems);
      }
      return attachedItems;
    };
    return item.creator(dyn);
  }
};

/**
 * Exports.
 */
module.exports = {
  resolveDepItems, getItem,
};
