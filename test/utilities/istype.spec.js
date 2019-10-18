/**
 * @theroyalwhee0/dynasty:test/utilities/istype.spec.js
 */

/**
 * Imports.
 */
const chai = require('chai');
const { isObject, isFunction, canHaveMembers } = require('../../src/utilities/istype');
const { expect } = chai;

/**
 * Test.
 */
describe('dynasty', () => {
    describe('utilities istype', () => {
        describe('isObject', () => {
            it('should be a function', () => {
                expect(isObject).to.be.a('function');
                expect(isObject.length).to.equal(1);
            });
            it('should identify objects', () => {
                const value = { };
                const results = isObject(value);
                expect(results).to.equal(true);                  
            });
            describe('should correctly identify non-objects', () => {
                it('such as undefined', () => {
                    const results = isObject();
                    expect(results).to.equal(false);
                });                
                it('such as null', () => {
                    const value = null;
                    const results = isObject(value);
                    expect(results).to.equal(false);
                });
                it('such as arrays', () => {
                    const value = [];
                    const results = isObject(value);
                    expect(results).to.equal(false);
                });                
                it('such as functions', () => {
                    const value = () => { };
                    const results = isObject(value);
                    expect(results).to.equal(false);
                });                
            });            
        });
        describe('isFunction', () => {
            it('should be a function', () => {
                expect(isFunction).to.be.a('function');
                expect(isFunction.length).to.equal(1);
            });
            it('should identify functions', () => {                
                const value = () => { };
                const results = isFunction(value);
                expect(results).to.equal(true);
            });
            describe('should correctly identify non-functions', () => {
                it('such as undefined', () => {
                    const results = isFunction();
                    expect(results).to.equal(false);
                });                
                it('such as null', () => {
                    const value = null;
                    const results = isFunction(value);
                    expect(results).to.equal(false);
                });
            });
        });
        describe('isArray', () => {
            it('should be a function', () => {
                expect(isFunction).to.be.a('function');
            });
            // NOTE: No other tests for isArray, it is just exported from Array.
        });
        describe('canHaveMembers', () => {
            it('should be a function', () => {
                expect(canHaveMembers).to.be.a('function');
                expect(canHaveMembers.length).to.equal(1);
            });
            it('should identify objects', () => {                
                const value = { };
                const results = canHaveMembers(value);
                expect(results).to.equal(true);
            });
            it('should identify arrays', () => {
                const value = [ ];
                const results = canHaveMembers(value);
                expect(results).to.equal(true);
            });            
            it('should identify functions', () => {                
                const value = () => { };
                const results = canHaveMembers(value);
                expect(results).to.equal(true);
            });                        
            describe('should correctly identify types that can not have members', () => {
                it('such as undefined', () => {
                    const results = canHaveMembers();
                    expect(results).to.equal(false);
                });
                it('such as null', () => {
                    const value = null;
                    const results = canHaveMembers(value);
                    expect(results).to.equal(false);
                });
                it('such as numbers', () => {
                    const value = 56;
                    const results = canHaveMembers(value);
                    expect(results).to.equal(false);
                });              
                it('such as strings', () => {
                    const value = "abc";
                    const results = canHaveMembers(value);
                    expect(results).to.equal(false);
                });                
            });
        });
    });    
});
