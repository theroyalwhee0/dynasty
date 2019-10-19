/**
 * @theroyalwhee0/dynasty:test/member/entrypoint.spec.js
 */

/**
 * Imports.
 */
const chai = require('chai');
const { spy } = require('sinon');
const entryPointFactory = require('../../src/members/entrypoint');
const { mockAdd, mockCoreContext } = require('./members.mock');
const { expect } = chai;

/**
 * Test.
 */
describe('dynasty', () => {
  describe('members', () => {
    describe('entryPointFactory', () => {
      it('should be a function', () => {
        expect(entryPointFactory).to.be.a('function');
        expect(entryPointFactory.length).to.equal(1);
      });
      it('should build the entryPoint function', () => {
        const context = mockCoreContext();
        const entryPoint = entryPointFactory(context);
        expect(entryPoint).to.be.a('function');
        expect(entryPoint.length).to.equal(0);
      });
      it('should be able to be used to add nodes', async () => {
        // Build mocks.
        const context = mockCoreContext();
        const add = mockAdd(context);
        // Build once function.
        const entryPoint = entryPointFactory(context);
        expect(entryPoint).to.be.a('function');
        expect(entryPoint.length).to.equal(0);
        // Build entryPoint param.
        const pmEntryPoint = entryPoint();
        expect(pmEntryPoint).to.be.a('promise');
        const entryPointParam = await pmEntryPoint;
        expect(entryPointParam).to.be.a('function');
        expect(entryPointParam.length).to.equal(1);
        const spiedParam = spy(entryPointParam);
        // Add node.
        await add('item1', spiedParam);
        // Evaluate results.
        expect(spiedParam.callCount).to.equal(1);
        const { item1 } = context.items;
        expect(item1).to.be.an('object');
        // Check output of creator.
        expect(item1.creator).to.be.a('function');
        const pmCreator = item1.creator();
        expect(pmCreator).to.be.a('promise');
        const results = await pmCreator;
        expect(results).to.equal(undefined);
      });
    });
  });
});
