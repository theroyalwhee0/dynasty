/**
 * @theroyalwhee0/dynasty:test/utilities/promises.spec.js
 */

/**
 * Imports.
 */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { allOfObject } = require('../../src/utilities/promises');
chai.use(chaiAsPromised);
const { expect } = chai;

/**
 * Test.
 */
describe('dynasty', () => {
    describe('utilities', () => {
        describe('promises', () => {
            describe('allOfObject', () => {        
                it('should be a function', () => {
                    expect(allOfObject).to.be.a('function');
                    expect(allOfObject.length).to.equal(1);
                });
                if('should resolve an object as an object', async () => {
                    const input = {
                        a: Promise.resolve(1),
                        bb: Promise.resolve(200),
                        ccc: Promise.resolve('3000'),
                    };
                    const pm = allOfObject(input);
                    expect(pm).to.be.a('promise');
                    const results = await pm;
                    expect(results).to.be.an('object');
                    expect(results).to.deep.equal({
                        a: 1,
                        bb: 200,
                        ccc: '3000',
                    });
                });
                it('should reject if not given argument', async () => {
                    await expect(allOfObject()).to.be.rejectedWith(Error, '"promises" must be an object'); 
                });
                it('should reject if any promise rejects', async () => {
                    const input = {
                        a: Promise.resolve(1),
                        bb: Promise.reject(new Error('"bb" rejected')),
                        ccc: Promise.reject(new Error('"ccc" rejected')),
                    };
                    const pm = allOfObject(input);
                    expect(pm).to.be.a('promise');
                    await expect(pm).to.be.rejectedWith(Error, '"bb" rejected');                     
                });
            });
        });
    });    
});
