/**
 * @theroyalwhee0/dynasty:test/general.mock.js
 */

/**
 * Imports.
 */
const { DepGraph } = require('dependency-graph');
const { spy } = require('sinon');

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
