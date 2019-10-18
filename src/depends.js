/**
 * @theroyalwhee0/dynasty:src/depends.js
 */

/**
 * Imports.
 */
const { DepGraph } = require('dependency-graph');

/**
 * Transform dependancies.
 * @param  {Array<[Object,String]>} deps The dependancies to transform.
 * @return {Object}      The dependancies.
 */
function transformDeps(dependancies) {
  // NOTE: Object key is dependency name, object value is export name.
  if(!Array.isArray(dependancies)) {
    throw new Error('"dependancies" should be an array');
  }
  const depends = { };
  for(let item of dependancies) {
    if(typeof item === 'string') {
      depends[item] = item;
    } else if(item && typeof item === 'object' && !Array.isArray(item)) {
      for(let key in item) {
        const value = item[key];
        if(typeof value === 'string') {
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
 * Get direct dependancies of a DepGraph.
 * @method getDirectDependenciesOf
 * @param  {DepGraph}                depGraph The dependency graph.
 * @return {String}                 The name of the dependency.
 */
function getDirectDependenciesOf(depGraph, name) {
  if(!(depGraph instanceof DepGraph)) {
    throw new Error(`"depGraph" must be a DepGraph`);
  }
  if(!depGraph.hasNode(name)) {
    throw new Error(`Node "${name}" not found`);
  }
  return depGraph.outgoingEdges[name] || [ ];
}

/**
 * Build dependancies graph.
 */
function buildGraph(items) {
  //console.log('@@ items', JSON.stringify(items, null, '  '));
  // NOTE: Object key is dependency name, object value is export name.
  const depGraph = new DepGraph();
  const keys = Object.keys(items);
  for(const name of keys) {
    // NOTE: All items must be added to graph before the dependancies are added.
    const item = items[name];
    depGraph.addNode(name, item);
  }
  for(const name of keys) {
    const item = items[name];
    const deps = Object.assign({ }, item && item.depends, item && item.attach);
    for(const key of Object.keys(deps)) {
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
  transformDeps, getDirectDependenciesOf, buildGraph,
};
