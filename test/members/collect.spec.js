/**
 * @theroyalwhee0/dynasty:test/member/collect.spec.js
 */

/**
 * Imports.
 */
const chai = require('chai');
const { spy } = require('sinon');
const collectFactory = require('../../src/members/collect');
const { mockAdd, mockCoreContext: mockCoreContext } = require('./members.mock');
const { mockDyn } = require('../general.mock');
const { expect } = chai;

/**
 * Test.
 */
describe('dynasty', () => {
  describe('members', () => {
    describe('collectFactory', () => {
      it('should be a function', () => {
        expect(collectFactory).to.be.a('function');
        expect(collectFactory.length).to.equal(0);
      });
      it('should build the collect function', () => {
        const context = mockCoreContext();
        const collect = collectFactory(context);
        expect(collect).to.be.a('function');
        expect(collect.length).to.equal(0);
      });
      it('should be able to be used to add nodes', async () => {
        // Build mocks.
        const context = mockCoreContext();
        const add = mockAdd(context);
        const dyn = mockDyn({
          'item2': 'value2',
          'item3': 'value3',
        });
        // Build collect function.
        const collect = collectFactory(context);
        expect(collect).to.be.a('function');
        expect(collect.length).to.equal(0);
        // collect builder.
        const pmcollect = collect();
        expect(pmcollect).to.be.a('promise');
        const collectParam = await pmcollect;
        expect(collectParam).to.be.a('function');
        expect(collectParam.length).to.equal(1);
        const spiedParam = spy(collectParam);
        // Add node.
        await add('item1', spiedParam);
        // Evaluate results.
        expect(spiedParam.callCount).to.equal(1);
        const { item1 } = context.items;
        expect(item1).to.be.an('object');
        // Check output of creator.
        expect(item1.creator).to.be.a('function');
        const pmCreator = item1.creator(dyn);
        expect(dyn.callCount).to.equal(1);
        expect(pmCreator).to.be.a('promise');
        const results = await pmCreator;
        expect(results).to.deep.equal({
          'item2': 'value2',
          'item3': 'value3',
        });
      });
    });
  });
});
