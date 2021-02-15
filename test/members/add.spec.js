/**
 * @theroyalwhee0/dynasty:test/member/add.spec.js
 */

/**
 * Imports.
 */
const { describe, it, expect } = require('../testing');
const { addFactory } = require('../../src/members/add');
const { mockCreator, mockParam, mockCoreContext } = require('../mocks/members');

/**
 * Test.
 */
describe('dynasty', () => {
  describe('members', () => {
    describe('addFactory', () => {
      it('should be a function', () => {
        expect(addFactory).to.be.a('function');
        expect(addFactory.length).to.equal(1);
      });
      it('should build the add function', () => {
        const context = mockCoreContext();
        const add = addFactory(context);
        expect(add).to.be.a('function');
      });
      it('should be able to add nodes', async () => {
        const context = mockCoreContext();
        const add = addFactory(context);
        const creator = mockCreator();
        const paramFn = mockParam();
        const pm = add('item1', creator, paramFn);
        expect(pm).to.be.a('promise');
        const addResults = await pm;
        expect(addResults).to.equal(undefined);
        await add('item2', creator, paramFn);
        expect(context.actions.config.length).to.equal(0);
        expect(context.actions.add.length).to.equal(2);
        const actionResults = await Promise.all(context.actions.config.concat(context.actions.add));
        expect(actionResults).to.deep.equal([ undefined, undefined ]);
        expect(creator.callCount).to.equal(2);
        expect(paramFn.callCount).to.equal(2);
        expect(Object.keys(context.items)).to.deep.equal([ 'item1', 'item2' ]);
        const { item1 } = context.items;
        expect(item1).to.be.an('object');
        expect(item1.name).to.equal('item1');
        expect(item1.creator).to.be.a('function');
        expect(item1.creator.length).to.equal(1);
      });
      it('should reject if node name is not unique', async () => {
        const context = mockCoreContext();
        const add = addFactory(context);
        const creator = mockCreator();
        add('item1', creator);
        return expect(add('item1', creator)).to.be.rejectedWith(Error, /item named "item1" already added/i);
      });
      it('should reject if multiple creators added', async () => {
        const context = mockCoreContext();
        const add = addFactory(context);
        const creator = mockCreator();
        return expect(add('item1', creator, creator)).to.be.rejectedWith(Error, /"creator" already attached to node/i);
      });
      it('should reject if not given a creator', async () => {
        const context = mockCoreContext();
        const add = addFactory(context);
        const paramFn = mockParam();
        return expect(add('item1', paramFn)).to.be.rejectedWith(Error, /item named "item1" missing a creator/i);
      });
    });
  });
});
