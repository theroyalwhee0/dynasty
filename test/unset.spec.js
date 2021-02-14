/**
 * @theroyalwhee0/dynasty:test/unset.spec.js
 */

/**
 * Imports.
 */
const { describe, it, expect } = require('./testing');
const UNSET = require('../src/unset');

/**
 * Test.
 */
describe('dynasty', () => {
  describe('UNSET', () => {
    it('should be a symbol', () => {
      expect(UNSET).to.be.a('symbol');
      expect(UNSET.toString()).to.equal('Symbol(UNSET)');
    });
  });
});
