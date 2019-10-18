/**
 * @theroyalwhee0/dynasty:test/items.spec.js
 */

/**
 * Imports.
 */
const chai = require('chai');
const { spy } = require('sinon');
const { resolveDepItems } = require('../src/items');
const { mockDepends } = require('./general.mock.js');
const { expect } = chai;

/**
 * Mock getItem.
 */
function mockGetItem() {
    return () => { };
}

/**
 * Test.
 */
describe('dynasty', () => {
    describe('items', () => {
        describe('resolveDepItems', () => {
            it('should be a function', () => {
                expect(resolveDepItems).to.be.a('function');
                expect(resolveDepItems.length).to.equal(3);
            });
            it('should resolve dependant items', async () => {
                const depGraph = mockDepends({
                    item1: [ 'item2', 'item3' ],
                    item2: true,
                    item3: true,
                });
                const getItemFromGraph = spy((depName, depGraph) => {
                    return Promise.resolve(`value of ${depName}`);
                });
                const pm = resolveDepItems('item1', depGraph, getItemFromGraph);                
                expect(pm).to.be.a('promise');
                const results = await pm;
                expect(getItemFromGraph.callCount).to.equal(2);
                expect(results).to.deep.equal({
                    'item2': 'value of item2',
                    'item3': 'value of item3',
                });
            });
            it('should resolve if there are no dependent items', async () => {
                const depGraph = mockDepends({
                    item1: { }
                });
                const getItem = mockGetItem();
                const pm = resolveDepItems('item1', depGraph, getItem);                
                expect(pm).to.be.a('promise');
                const results = await pm;
                expect(results).to.deep.equal({});
            });
            it('should reject if item not found', async () => {
                const depGraph = mockDepends();
                const getItem = mockGetItem();
                const pm = resolveDepItems('item1', depGraph, getItem);
                expect(pm).to.be.rejectedWith(Error, /node "item1" not found/i);
            });
        });
    });
});