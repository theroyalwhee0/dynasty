/**
 * @theroyalwhee0/dynasty:test/member/extend.spec.js
 */

/**
 * Imports.
 */
const chai = require('chai');
const { spy } = require('sinon');
const extendFactory = require('../../src/members/extend');
const { mockAdd, mockCreator, mockCoreContext } = require('./members.mock');
const { expect } = chai;

/**
 * Test.
 */
describe('dynasty', () => {
    describe('members', () => {
        describe('extendFactory', () => {            
            it('should be a function', () => {
                expect(extendFactory).to.be.a('function');
                expect(extendFactory.length).to.equal(0);
            });
            it('should build the extend function', () => {
                const context = mockCoreContext();
                const extend = extendFactory(context);
                expect(extend).to.be.a('function');
                expect(extend.length).to.equal(1);
            });
            it('should be able to be used to add nodes', async () => {
                // Build mocks.
                const context = mockCoreContext();
                const add = mockAdd(context);
                const creator = mockCreator();
                // Build once function.
                const extend = extendFactory(context);
                expect(extend).to.be.a('function');
                expect(extend.length).to.equal(1);
                // Build args param.
                const pmArgs = extend({
                    item2: 'one',
                    item3: 2,
                    item4: 'three'
                });
                expect(pmArgs).to.be.a('promise');
                const extendParam = await pmArgs;
                expect(extendParam).to.be.a('function');
                expect(extendParam.length).to.equal(1);
                const spiedParam = spy(extendParam);
                // Add node.
                await add('item1', creator, spiedParam);
                // Evaluate results.
                expect(spiedParam.callCount).to.equal(1);
                expect(spiedParam.returnValues[0]).to.be.a('promise');                
                const { item1 } = context.items;
                expect(item1).to.be.an('object');
                expect(item1.extend).to.be.an('object');
                expect(item1.extend).to.deep.equal({
                    item2: 'one',
                    item3: 2,
                    item4: 'three'
                });
            });
        });
    });
});
