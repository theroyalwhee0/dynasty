/**
 * @theroyalwhee0/dynasty:test/member/depends.spec.js
 */

/**
 * Imports.
 */
const chai = require('chai');
const { spy } = require('sinon');
const dependsFactory = require('../../src/members/depends');
const { mockAdd, mockCreator, mockCoreContext } = require('./members.mock');
const { expect } = chai;

/**
 * Test.
 */
describe('dynasty', () => {
    describe('members', () => {
        describe('dependsFactory', () => {
            // NOTE: dependsFactory and attachFactory are identical except for the key they populate on the item.
            it('should be a function', () => {
                expect(dependsFactory).to.be.a('function');
                expect(dependsFactory.length).to.equal(0);
            });
            it('should build the depends function', () => {
                const context = mockCoreContext();
                const depends = dependsFactory(context);
                expect(depends).to.be.a('function');
                expect(depends.length).to.equal(0);
            });
            it('should be able to be used to add nodes', async () => {
                // Build mocks.
                const context = mockCoreContext();
                const add = mockAdd(context);
                const creator = mockCreator();
                // Build once function.
                const depends = dependsFactory(context);
                expect(depends).to.be.a('function');
                expect(depends.length).to.equal(0);
                // Build args param.
                const pmArgs = depends(
                    'item2', { item3: 'alias1' }
                );
                expect(pmArgs).to.be.a('promise');
                const dependsParam = await pmArgs;
                expect(dependsParam).to.be.a('function');
                expect(dependsParam.length).to.equal(1);
                const spiedParam = spy(dependsParam);
                // Add node.
                await add('item1', creator, spiedParam);
                // Evaluate results.
                expect(spiedParam.callCount).to.equal(1);
                expect(spiedParam.returnValues[0]).to.be.a('promise');
                const { item1 } = context.items;
                expect(item1).to.be.an('object');
                expect(item1.depends).to.be.an('object');
                expect(item1.depends).to.deep.equal({
                    item2: 'item2',
                    item3: 'alias1',
                });
            });
        });
    });
});
