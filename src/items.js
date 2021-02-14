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
const jsonpath = require('jsonpath');
const { allProps } = require('@theroyalwhee0/please');
const { isObject } = require('@theroyalwhee0/istype');

/**
 * Get an item from the dependency tree.
 */
async function getItem(name, depGraph, context) {
  const { items } = context;
  const item = items[name];
  if(item === undefined) {
    return Promise.reject(new Error(`No item found with name of "${name}"`));
  } else {
    const names = depGraph.directDependenciesOf(name);
    const deps = { };
    for(let depName of names) {
      const dep = getItem(depName, depGraph, context);
      deps[depName] = dep;
    }
    const depItems = await allProps(deps);
    const attachedItems = Object.assign({ }, item.extend);
    if(item.attach) {
      const attachKeys = Object.keys(item.attach);
      for(let loop=0; loop < attachKeys.length; loop++) {
        const key = attachKeys[loop];
        const attachAs = item.attach[key];
        if(/^\$/.test(key)) {
          const [ name, value ] = getConfigItem(key, context);
          attachedItems[name] = value;
          continue;
        }
        if(!(key in depItems)) {
          throw new Error(`Attach key '${key}' not found in dependent items.`);
        }
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
 * Get configuration item.
 * REF: https://github.com/dchester/jsonpath#readme
 * '$[key]' = Entire configuration object.
 * '$[key]=[jsonpath-query]' = Run a jsonpath query that results in a single item.
 * '$$[key]=[jsonpath-query]' = Run a jsonpath query that results in multiple items.
 */
function getConfigItem(name, context) {
  const { config } = context;
  const match = /^\$(\$)?([a-z0-9_]+)(?:=(.+))?$/i.exec(name);
  if(match) {
    const isMultiple = match[1] === '$';
    const key = match[2];
    const query = match[3];
    if(query) {
      if(isMultiple) {
        return [ key, jsonpath.query(config, query) ];
      } else {
        return [ key, jsonpath.value(config, query) ];
      }
    } else {
      return [ key, config ];
    }
  }
  throw new Error(`'${name}' is an invalid config item.`);
}

/**
 * Exports.
 */
module.exports = {
  getItem,
  getConfigItem,
};
