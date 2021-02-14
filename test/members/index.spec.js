/**
 * @theroyalwhee0/dynasty:test/member/index.spec.js
 */

/**
 * Imports.
 */
const { describe, it, expect } = require('../testing');
const { configuratorFactory } = require('../../src/members/index');
const { mockCoreContext } = require('../mocks/members');

/**
 * Test.
 */
describe('dynasty', () => {
  describe('members', () => {
    describe('configuratorFactory', () => {
      it('should be a function', () => {
        expect(configuratorFactory).to.be.a('function');
        expect(configuratorFactory.length).to.equal(1);
      });
      it('should build a configurator object', () => {
        const context = mockCoreContext();
        const configurator = configuratorFactory(context);
        expect(configurator).to.be.an('object');
        const keys = Object.keys(configurator);
        expect(keys).to.eql([
          'add',        'args',       'attach',
          'call',       'collect',    'config',
          'depends',    'entryPoint', 'extend',
          'once',       'pullMember', 'value',
        ]);

      });
    });
  });
});
