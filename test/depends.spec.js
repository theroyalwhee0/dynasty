/**
 * @theroyalwhee0/dynasty:test/depends.spec.js
 */

/**
 * Imports.
 */
const chai = require('chai');
const { DepGraph } = require('dependency-graph');
const { buildGraph, transformDeps, getDirectDependenciesOf } = require('../src/depends');
const { mockDepends } = require('./general.mock');
const { expect } = chai;

/**
 * Test.
 */
describe('dynasty', () => {
    describe('depends', () => {
        describe('buildGraph', () => {
            it('should be a function', () => {
                expect(buildGraph).to.be.a('function');
                expect(buildGraph.length).to.equal(1);
            });
            it('should be able to build an empty graph', () => {
                const dg = buildGraph({ });
                expect(dg).to.be.an.instanceOf(DepGraph);
                const nodeNames = Object.keys(dg.nodes);
                expect(nodeNames.length).to.equal(0);
            });
            it('should be able to build a graph', () => {
                const input = {
                    "start": {
                        "name": "start",
                        "depends": { "app": "app" }
                    },
                    "app": {
                        "name": "app",
                        "attach": { "log": "log" },
                        "depends": { "reports": "reports" }
                    },
                    "log": { "name": "log" },
                    "reports": { "name": "reports" }
                };
                const dg = buildGraph(input);
                expect(dg).to.be.an.instanceOf(DepGraph);
                expect(dg.nodes).to.deep.equal({
                    "start": {
                        "name": "start",
                        "depends": { "app": "app" }
                    },
                    "app": {
                        "name": "app",
                        "attach": { "log": "log" },
                        "depends": { "reports": "reports" }
                    },
                    "log": { "name": "log" },
                    "reports": { "name": "reports" }
                });
                expect(dg.outgoingEdges).to.deep.equal({
                    "start": [ "app" ],
                    "app": [ "reports", "log" ],
                    "log": [],
                    "reports": []
                });                
                expect(dg.incomingEdges).to.deep.equal({
                    "start": [],
                    "app": [ "start" ],
                    "log": [ "app" ],
                    "reports": [ "app" ]
                });
                expect(dg.circular).to.equal(undefined);
            });            
        });
        describe('getDirectDependenciesOf', () => {
            it('should be a function', () => {
                expect(getDirectDependenciesOf).to.be.a('function');
                expect(getDirectDependenciesOf.length).to.equal(2);
            });
            it('should throw if not given depgraph', async () => {
                expect(() => {
                    getDirectDependenciesOf(null, 'dne');
                }).to.throw('"depGraph" must be a DepGraph');
            });
            it('should throw if node not found', () => {
                const depGraph= mockDepends();
                expect(() => {
                    getDirectDependenciesOf(depGraph, 'dne');
                }).to.throw('Node "dne" not found');
            });
            it('should get direct depends', () => {
                const depGraph = mockDepends({
                    aaa: true,
                    bbb: [ 'aaa', 'ccc' ],
                    ccc: [ 'ddd' ],
                    ddd: [ 'eee' ],
                    eee: true,
                });
                const results = getDirectDependenciesOf(depGraph, 'bbb');
                expect(results).to.deep.equal([ 'aaa', 'ccc' ]);
            });
            it('should get direct depends even if empty', () => {
                const depGraph = mockDepends({
                    aaa: true,
                    bbb: [ 'aaa', 'ccc' ],
                    ccc: [ 'ddd' ],
                    ddd: [ 'eee' ],
                    eee: true,
                });
                const results = getDirectDependenciesOf(depGraph, 'eee');
                expect(results).to.deep.equal([ ]);
            });            
        });
        describe('transformDeps', () => {
            // NOTE: Object key is dependency name, object value is export name.
            it('should be a function', () => {
                expect(transformDeps).to.be.a('function');
                expect(transformDeps.length).to.equal(1);
            });
            it('should transform simple dependencies', () => {
                const results = transformDeps([ 'item1', 'item2' ]);
                expect(results).to.be.an('object');
                expect(results).to.deep.equal({
                    item1: 'item1',
                    item2: 'item2',
                });
            });
            it('should transform aliased dependencies', () => {
                const results = transformDeps([ 'item1', { item2: 'alias1' } ]);
                expect(results).to.be.an('object');
                expect(results).to.deep.equal({
                    item1: 'item1',                    
                    item2: 'alias1',
                });
            });
            it('should throw if given an array', () => {
                // NOTE: Numbers are not supported as names.
                expect(() => {
                    transformDeps({ });
                }).to.throw(/"dependancies" should be an array/i);
            });            
            it('should throw if given invalid type', () => {
                // NOTE: Numbers are not supported.
                expect(() => {
                    transformDeps([ 1000 ]);
                }).to.throw(/unrecognized value "1000" \(number\)/i);
            });
            it('should throw if given invalid object value type', () => {
                // NOTE: Numbers are not supported.
                expect(() => {
                    transformDeps([ { item1: 1000 } ]);
                }).to.throw(/unrecognized object value "1000" \(number\)/i);
            });            
        });
    });
});
