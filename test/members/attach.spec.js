/**
 * @theroyalwhee0/dynasty:test/member/attach.spec.js
 */

/**
 * Imports.
 */
const chai = require('chai');
const { spy } = require('sinon');
const attachFactory = require('../../src/members/attach');
const { mockAdd, mockCreator, mockCoreContext } = require('./members.mock');
const { expect } = chai;

/**
 * Test.
 */
describe('dynasty', () => {
    describe('members', () => {
        describe('attachFactory', () => {            
            it('should be a function', () => {
                expect(attachFactory).to.be.a('function');
                expect(attachFactory.length).to.equal(0);
            });
            it('should build the attach function', () => {
                const context = mockCoreContext();
                const attach = attachFactory(context);
                expect(attach).to.be.a('function');
                expect(attach.length).to.equal(0);
            });
            it('should be able to be used to add nodes', async () => {
                // Build mocks.
                const context = mockCoreContext();
                const add = mockAdd(context);
                const creator = mockCreator();
                // Build once function.
                const attach = attachFactory(context);
                expect(attach).to.be.a('function');
                expect(attach.length).to.equal(0);
                // Build args param.
                const pmArgs = attach(
                    'item2', { item3: 'alias1' }
                );
                expect(pmArgs).to.be.a('promise');
                const attachParam = await pmArgs;
                expect(attachParam).to.be.a('function');
                expect(attachParam.length).to.equal(1);
                const spiedParam = spy(attachParam);
                // Add node.
                await add('item1', creator, spiedParam);
                // Evaluate results.
                expect(spiedParam.callCount).to.equal(1);
                expect(spiedParam.returnValues[0]).to.be.a('promise');                
                const { item1 } = context.items;
                expect(item1).to.be.an('object');
                expect(item1.attach).to.be.an('object');
                expect(item1.attach).to.deep.equal({
                    item2: 'item2',
                    item3: 'alias1',
                });
            });
        });
    });
});
