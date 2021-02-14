/**
 * @theroyalwhee0/dynasty:test/member/value.spec.js
 */

/**
 * Imports.
 */
const { describe, it, expect, spy } = require('../testing');
const { valueFactory } = require('../../src/members/value');
const { mockAdd, mockParam, mockCoreContext } = require('../mocks/members');

/**
 * Test.
 */
describe('dynasty', () => {
  describe('members', () => {
    describe('valueFactory', () => {
      it('should be a function', () => {
        expect(valueFactory).to.be.a('function');
        expect(valueFactory.length).to.equal(0);
      });
      it('should build the value function', () => {
        const context = mockCoreContext();
        const value = valueFactory(context);
        expect(value).to.be.a('function');
        expect(value.length).to.equal(1);
      });
      it('should be able to be used to add nodes', async () => {
        // Build mocks.
        const context = mockCoreContext();
        const add = mockAdd(context);
        // Build value function.
        const value = valueFactory(context);
        expect(value).to.be.a('function');
        expect(value.length).to.equal(1);
        // Call builder.
        const pmValue = value(1234);
        expect(pmValue).to.be.a('promise');
        const valueParam = await pmValue;
        expect(valueParam).to.be.a('function');
        expect(valueParam.length).to.equal(1);
        const spiedParam = spy(valueParam);
        // Add node.
        await add('item1', spiedParam);
        // Evaluate results.
        expect(spiedParam.callCount).to.equal(1);
        const { item1 } = context.items;
        expect(item1).to.be.an('object');
        // Check output of creator.
        expect(item1.creator).to.be.a('function');
        const pm = item1.creator();
        expect(pm).to.be.a('promise');
        const results = await pm;
        expect(results).to.equal(1234);
      });
      it('should reject if no value given', async () => {
        // Build mocks.
        const context = mockCoreContext();
        const add = mockAdd(context);
        // Test value function with no arguments.
        const value = valueFactory(context);
        return expect(value()).to.be.rejectedWith(Error, /"contents" is required/i);
      });
      it('sould reject if an args modifier is attached', async () => {
        // Build mocks.
        const context = mockCoreContext();
        const add = mockAdd(context);
        // Build once function.
        const value = valueFactory(context);
        // Call builder.
        const valueParam = spy(await value(888));
        // Add node.
        await add('item1', valueParam, mockParam((item) => {
          item.args = [ 'A', 2, 'B', 4 ];
        }));
        // Evaluate results.
        expect(valueParam.callCount).to.equal(1);
        const { item1 } = context.items;
        expect(item1).to.be.an('object');
        expect(item1.creator).to.be.a('function');
        return expect(item1.creator()).to.be.rejectedWith(Error, /"value" creator does not support "args" property/i);
      });
    });
  });
});
