/**
 * @theroyalwhee0/dynasty:test/member/config.spec.js
 */

/**
 * Imports.
 */
const { describe, it, expect } = require('../testing');
const { configFactory } = require('../../src/members/config');
const { mockCoreContext } = require('../mocks/members');

/**
 * Test.
 */
describe('dynasty', () => {
  describe('members', () => {
    describe('configFactory', () => {
      it('should be a function', () => {
        expect(configFactory).to.be.a('function');
        expect(configFactory.length).to.equal(1);
      });
      it('should build the config function', () => {
        const context = mockCoreContext();
        const config = configFactory(context);
        expect(config).to.be.a('function');
        expect(config.length).to.equal(1);
      });
      it('should be able to set config items', async () => {
        // Build mocks.
        const context = mockCoreContext();
        const config = configFactory(context);
        config({ a: 1, b: 2, c: [3] });
        expect(context.config).to.eql({ a: 1, b: 2, c: [3] });
      });
      it('should deep merge config items', async () => {
        // Build mocks.
        const context = mockCoreContext();
        const config = configFactory(context);
        config({ a: 1, b: 2, c: [3] });
        config({ a: 'one', c: [ 4, 5, 6 ], d: 'Dee' });
        expect(context.config).to.eql({ a: 'one', b: 2, c: [ 3, 4, 5, 6 ], d: 'Dee' });
      });
    });
  });
});
