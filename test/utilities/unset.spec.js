/**
 * @theroyalwhee0/dynasty:test/utilities/unset.spec.js
 */

/**
 * Imports.
 */
const chai = require('chai');
const UNSET = require('../../src/utilities/unset');
const { expect } = chai;

/**
 * Test.
 */
describe('dynasty', () => {
    describe('utilities', () => {
        describe('UNSET', () => {
            it('should be a symbol', () => {
                expect(UNSET).to.be.a('symbol');
                expect(UNSET.toString()).to.equal('Symbol(UNSET)');
            });
        });
    });    
});
