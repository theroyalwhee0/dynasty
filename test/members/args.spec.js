/**
 * @theroyalwhee0/dynasty:test/member/args.spec.js
 */

/**
 * Imports.
 */
const chai = require('chai');
const { spy } = require('sinon');
const argsFactory = require('../../src/members/args');
const { mockAdd, mockCreator, mockCoreContext } = require('./members.mock');
const { expect } = chai;

/**
 * Test.
 */
describe('dynasty', () => {
  describe('members', () => {
    describe('argsFactory', () => {
      it('should be a function', () => {
        expect(argsFactory).to.be.a('function');
        expect(argsFactory.length).to.equal(0);
      });
      it('should build the args function', () => {
        const context = mockCoreContext();
        const args = argsFactory(context);
        expect(args).to.be.a('function');
        expect(args.length).to.equal(0);
      });
      it('should be able to be used to add nodes', async () => {
        // Build mocks.
        const context = mockCoreContext();
        const add = mockAdd(context);
        const creator = mockCreator();
        // Build once function.
        const args = argsFactory(context);
        expect(args).to.be.a('function');
        expect(args.length).to.equal(0);
        // Build args param.
        const pmArgs = args(0, 'A', 'B', 3, null);
        expect(pmArgs).to.be.a('promise');
        const argsParam = await pmArgs;
        expect(argsParam).to.be.a('function');
        expect(argsParam.length).to.equal(1);
        const spiedParam = spy(argsParam);
        // Add node.
        await add('item1', creator, spiedParam);
        // Evaluate results.
        expect(spiedParam.callCount).to.equal(1);
        const { item1 } = context.items;
        expect(item1).to.be.an('object');
        expect(item1.args).to.be.an('array');
        expect(item1.args).to.have.members([
          0, 'A', 'B', 3, null,
        ]);
      });
    });
  });
});
