/**
 * @file Dynasty, asynchronous dependency injection.
 * @author Adam Mill <hismajesty@theroyalwhee.com>
 * @copyright Copyright 2019-2021 Adam Mill
 * @license Apache-2.0
 */

/**
 * Imports.
 */
const { DepGraph } = require('dependency-graph');
const { isArray, isString, isObject } = require('@theroyalwhee0/istype');

/**
 * Transform dependencies.
 * @param  {array<object|string>} deps The dependencies to transform.
 * @returns {object} The dependencies.
 */
function transformDeps(dependencies) {
  // NOTE: Object key is dependency name, object value is export name.
  if(!isArray(dependencies)) {
    throw new Error('"dependencies" should be an array');
  }
  const depends = { };
  for(let item of dependencies) {
    if(isString(item)) {
      depends[item] = item;
    } else if(isObject(item)) {
      for(let key in item) {
        const value = item[key];
        if(isString(value)) {
          depends[key] = value;
        } else {
          throw new Error(`Unrecognized object value "${value}" (${typeof value}) for key "${key}"`);
        }
      }
    } else {
      throw new Error(`Unrecognized value "${item}" (${typeof item})`);
    }
  }
  return depends;
}

/**
 * Build dependencies graph.
 * Configuration items are not included in the graph.
 *
 * @param {object} items Transform the itemsinto a dependency graph.
 * @returns {DepGraph} The resulting dependency graph.
 */
function buildGraph(items) {
  // NOTE: Object key is dependency name, object value is export name.
  const depGraph = new DepGraph();
  const keys = Object.keys(items);
  for(const name of keys) {
    // NOTE: All items must be added to graph before the dependencies are added.
    const item = items[name];
    depGraph.addNode(name, item);
  }
  for(const name of keys) {
    const item = items[name];
    const deps = Object.assign({ }, item && item.depends, item && item.attach);
    for(const key of Object.keys(deps)) {
      if(/^\$/.test(key)) {
        // These are config items.
        continue;
      }
      depGraph.addDependency(name, key);
    }
  }
  depGraph.overallOrder(); // Error check early.
  return depGraph;
};

/**
 * Exports.
 */
module.exports = {
  transformDeps, buildGraph,
};
