/**
 * @theroyalwhee0/dynasty:test/member/call.spec.js
 */

/**
 * Imports.
 */
const { describe, it, expect, spy } = require('../testing');
const { callFactory } = require('../../src/members/call');
const { mockAdd, mockParam, mockCoreContext } = require('../mocks/members');
const { mockDyn } = require('../mocks/general');

/**
 * Test.
 */
describe('dynasty', () => {
  describe('members', () => {
    describe('callFactory', () => {
      it('should be a function', () => {
        expect(callFactory).to.be.a('function');
        expect(callFactory.length).to.equal(0);
      });
      it('should build the call function', () => {
        const context = mockCoreContext();
        const call = callFactory(context);
        expect(call).to.be.a('function');
        expect(call.length).to.equal(1);
      });
      it('should be able to be used to add nodes', async () => {
        // Build mocks.
        const context = mockCoreContext();
        const add = mockAdd(context);
        const dyn = mockDyn();
        // Build call function.
        const call = callFactory(context);
        expect(call).to.be.a('function');
        expect(call.length).to.equal(1);
        // Create builder.
        let buildValue;
        const builder = spy(async function builder(dyn) {
          expect(dyn).to.be.a('function');
          expect(dyn.length).to.equal(1);
          const attached = dyn();
          expect(attached).to.be.an('object');
          expect(buildValue).to.equal(undefined);
          buildValue = Date.now();
          return buildValue;
        });
        // Call builder.
        const pmcall = call(builder);
        expect(pmcall).to.be.a('promise');
        const callParam = await pmcall;
        expect(callParam).to.be.a('function');
        expect(callParam.length).to.equal(1);
        const spiedParam = spy(callParam);
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
        expect(results).to.equal(buildValue);
        expect(builder.callCount).to.equal(1);
      });
      it('should be be able to be called multiple times', async () => {
        // Build mocks.
        const context = mockCoreContext();
        const add = mockAdd(context);
        // Build call function.
        const call = callFactory(context);
        expect(call).to.be.a('function');
        expect(call.length).to.equal(1);
        // Create builder.
        let buildValues = [ ];
        const builder = spy(async function builder() {
          // The build should be called every time.
          const now = Date.now();
          buildValues.push(now);
          return now;
        });
        // Call builder.
        const callParam = await call(builder);
        const spiedParam = spy(callParam);
        // Add node.
        await add('item1', spiedParam);
        // Evaluate results.
        expect(spiedParam.callCount).to.equal(1);
        const { item1 } = context.items;
        expect(item1).to.be.an('object');
        // Check output of creator.
        expect(item1.creator).to.be.a('function');
        const results = await item1.creator();
        expect(buildValues.length).to.equal(1);
        expect(results).to.equal(buildValues[0]);
        expect(builder.callCount).to.equal(1);
        // Check output of creator again.
        expect(item1.creator).to.be.a('function');
        const results2 = await item1.creator();
        expect(buildValues.length).to.equal(2);
        expect(results2).to.equal(buildValues[1]);
        expect(builder.callCount).to.equal(2);
      });
      it('should support args params', async () => {
        // Build mocks.
        const context = mockCoreContext();
        const add = mockAdd(context);
        const dyn = mockDyn();
        // Build call function.
        const call = callFactory(context);
        // Create builder.
        const builder = spy(async function builder(zero, one, two, three, dyn) {
          expect(zero).to.equal('A');
          expect(one).to.equal(2);
          expect(two).to.equal('B');
          expect(three).to.equal(4);
          expect(dyn).to.be.a('function');
          expect(dyn.length).to.equal(1);
          const attached = dyn();
          expect(attached).to.be.an('object');
          return [ zero, one, two, three ].join(',');
        });
        // Call builder.
        const callParam = spy(await call(builder));
        // Add node.
        await add('item1', callParam, mockParam((item) => {
          item.args = [ 'A', 2, 'B', 4 ];
        }));
        // Evaluate results.
        expect(callParam.callCount).to.equal(1);
        const { item1 } = context.items;
        expect(item1).to.be.an('object');
        // Check output of creator.
        expect(item1.creator).to.be.a('function');
        const results = await item1.creator(dyn);
        expect(results).to.equal('A,2,B,4');
      });
      it('should reject if not given a builder function', () => {
        const context = mockCoreContext();
        const call = callFactory(context);
        return expect(call()).to.be.rejectedWith(Error, /"builder" should be a function/i);
      });
    });
  });
});
