/**
 * @theroyalwhee0/dynasty:test/member/pullmember.spec.js
 */

/**
 * Imports.
 */
const { describe, it, expect, spy } = require('../testing');
const { pullMemberFactory } = require('../../src/members/pullmember');
const { mockAdd, mockCoreContext } = require('../mocks/members');
const { mockDyn } = require('../mocks/general');

/**
 * Test.
 */
describe('dynasty', () => {
  describe('members', () => {
    describe('pullMemberFactory', () => {
      it('should be a function', () => {
        expect(pullMemberFactory).to.be.a('function');
        expect(pullMemberFactory.length).to.equal(0);
      });
      it('should build the pullMember function', () => {
        const context = mockCoreContext();
        const pullMember = pullMemberFactory(context);
        expect(pullMember).to.be.a('function');
        expect(pullMember.length).to.equal(2);
      });
      describe('should be able to be used to add nodes', () => {
        it('given a member value', async () => {
          // Build mocks.
          const context = mockCoreContext();
          const add = mockAdd(context);
          const dyn = mockDyn({
            'item1': {
              'member1': 12345,
            },
          });
          // Build pullMember function.
          const pullMember = pullMemberFactory(context);
          expect(pullMember).to.be.a('function');
          expect(pullMember.length).to.equal(2);
          // Call builder.
          const pmPullMember = pullMember('item1', 'member1');
          expect(pmPullMember).to.be.a('promise');
          const pullMemberParam = await pmPullMember;
          expect(pullMemberParam).to.be.a('function');
          expect(pullMemberParam.length).to.equal(1);
          const spiedParam = spy(pullMemberParam);
          // Add node.
          await add('item1', spiedParam);
          // Evaluate results.
          expect(spiedParam.callCount).to.equal(1);
          const { item1 } = context.items;
          expect(item1).to.be.an('object');
          // Check output of creator.
          expect(item1.creator).to.be.a('function');
          const pm = item1.creator(dyn);
          expect(pm).to.be.a('promise');
          const results = await pm;
          expect(results).to.equal(12345);
        });
        it('given a member function to bind', async () => {
          // Build mocks.
          const context = mockCoreContext();
          const add = mockAdd(context);
          const obj = { };
          function member1() {
            expect(this).to.equal(obj);
            return this;
          }
          obj.member1 = member1;
          const dyn = mockDyn({
            'item1': obj,
          });
          // Build pullMember function.
          const pullMember = pullMemberFactory(context);
          expect(pullMember).to.be.a('function');
          expect(pullMember.length).to.equal(2);
          // Call builder.
          const pmPullMember = pullMember('item1', 'member1');
          expect(pmPullMember).to.be.a('promise');
          const pullMemberParam = await pmPullMember;
          expect(pullMemberParam).to.be.a('function');
          expect(pullMemberParam.length).to.equal(1);
          const spiedParam = spy(pullMemberParam);
          // Add node.
          await add('item1', spiedParam);
          // Evaluate results.
          expect(spiedParam.callCount).to.equal(1);
          const { item1 } = context.items;
          expect(item1).to.be.an('object');
          // Check output of creator.
          expect(item1.creator).to.be.a('function');
          const pm = item1.creator(dyn);
          expect(pm).to.be.a('promise');
          const results = await pm;
          expect(results).to.be.a('function');
          return results();
        });
      });
      it('should reject if target item does not exists', async () => {
        // Build mocks.
        const context = mockCoreContext();
        const add = mockAdd(context);
        const dyn = mockDyn();
        // Build pullMember function.
        const pullMember = pullMemberFactory(context);
        expect(pullMember).to.be.a('function');
        expect(pullMember.length).to.equal(2);
        // Call builder.
        const pmPullMember = pullMember('item1', 'member1');
        expect(pmPullMember).to.be.a('promise');
        const pullMemberParam = await pmPullMember;
        expect(pullMemberParam).to.be.a('function');
        expect(pullMemberParam.length).to.equal(1);
        const spiedParam = spy(pullMemberParam);
        // Add node.
        await add('item1', spiedParam);
        // Evaluate results.
        expect(spiedParam.callCount).to.equal(1);
        const { item1 } = context.items;
        expect(item1).to.be.an('object');
        // Check output of creator.
        expect(item1.creator).to.be.a('function');
        const pm = item1.creator(dyn);
        expect(pm).to.be.a('promise');
        return expect(pm).to.be.rejectedWith(Error, /node "item1" not attached/i);
      });
      it('should reject if target item can not have members', async () => {
        // Build mocks.
        const context = mockCoreContext();
        const add = mockAdd(context);
        const dyn = mockDyn({
          'item1': 'not-an-object',
        });
        // Build pullMember function.
        const pullMember = pullMemberFactory(context);
        expect(pullMember).to.be.a('function');
        expect(pullMember.length).to.equal(2);
        // Call builder.
        const pmPullMember = pullMember('item1', 'member1');
        expect(pmPullMember).to.be.a('promise');
        const pullMemberParam = await pmPullMember;
        expect(pullMemberParam).to.be.a('function');
        expect(pullMemberParam.length).to.equal(1);
        const spiedParam = spy(pullMemberParam);
        // Add node.
        await add('item1', spiedParam);
        // Evaluate results.
        expect(spiedParam.callCount).to.equal(1);
        const { item1 } = context.items;
        expect(item1).to.be.an('object');
        // Check output of creator.
        expect(item1.creator).to.be.a('function');
        const pm = item1.creator(dyn);
        expect(pm).to.be.a('promise');
        return expect(pm).to.be.rejectedWith(Error, /node "item1" can not have members/i);
      });
      it('should reject if target item does not have the specified member', async () => {
        // Build mocks.
        const context = mockCoreContext();
        const add = mockAdd(context);
        const dyn = mockDyn({
          'item1': { },
        });
        // Build pullMember function.
        const pullMember = pullMemberFactory(context);
        expect(pullMember).to.be.a('function');
        expect(pullMember.length).to.equal(2);
        // Call builder.
        const pmPullMember = pullMember('item1', 'member1');
        expect(pmPullMember).to.be.a('promise');
        const pullMemberParam = await pmPullMember;
        expect(pullMemberParam).to.be.a('function');
        expect(pullMemberParam.length).to.equal(1);
        const spiedParam = spy(pullMemberParam);
        // Add node.
        await add('item1', spiedParam);
        // Evaluate results.
        expect(spiedParam.callCount).to.equal(1);
        const { item1 } = context.items;
        expect(item1).to.be.an('object');
        // Check output of creator.
        expect(item1.creator).to.be.a('function');
        const pm = item1.creator(dyn);
        expect(pm).to.be.a('promise');
        return expect(pm).to.be.rejectedWith(Error, /node "item1" does not have a member "member1"/i);
      });
    });
  });
});
