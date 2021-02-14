/**
 * @theroyalwhee0/dynasty:test/mocks//general.js
 */

/**
 * Imports.
 */
const { spy } = require('../testing');
const { DepGraph } = require('dependency-graph');

/**
 * Mock depends.
 */
function mockDepends(config={}) {
  const depGraph = new DepGraph();
  for(let name in config) {
    depGraph.addNode(name, null);
  }
  for(let name in config) {
    const item = config[name];
    if(Array.isArray(item)) {
      for(let key of item) {
        depGraph.addDependency(name, key);
      }
    } else {
      // ASDF
      throw new Error(`?`);
    }
  }
  return depGraph;
}

/**
 * Mock dynasty 'dyn' function.
 */
function mockDyn(attached={}) {
  const dyn = spy((obj) => {
    if(obj && typeof obj === 'object') {
      Object.assign(obj, attached);
    }
    return attached;
  });
  dyn.isMock = true;
  return dyn;
}

/**
 * Exports.
 */
module.exports = {
  mockDepends, mockDyn,
};
