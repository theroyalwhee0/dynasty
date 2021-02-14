/**
 * @theroyalwhee0/dynasty:test/dynasty.spec.js
 */

/**
 * Imports.
 */
const { describe, it, expect, spy } = require('./testing');
const { dynasty } = require('../src');

/**
 * Test.
 */
describe('dynasty', () => {
  it('should be a function', () => {
    expect(dynasty).to.be.a('function');
    expect(dynasty.length).to.equal(1);
  });
  it('should reject if not given callback', async () => {
    expect(dynasty()).to.be.rejectedWith(Error, '"callback" must be a function');
  });
  it('should do nothing if given an empty callback', async () => {
    const cb = spy();
    const pm = dynasty(cb);
    expect(pm).to.be.a('promise');
    const results = await pm;
    expect(cb.callCount).to.equal(1);
    const call = cb.getCall(0);
    expect(call.args.length).to.equal(1);
    expect(call.args[0]).to.be.an('object');
    const configurator = call.args[0];
    expect(configurator.add).to.be.a('function');
    expect(configurator.once).to.be.a('function');
    expect(configurator.value).to.be.a('function');
    expect(results).to.equal(undefined);
  });
  it('should handle a basic case', async () => {
    const item1Factory = spy(function item1Factory(dyn) {
      expect(dyn).to.be.a('function');
      const dynResults = dyn();
      expect(dynResults).to.be.an('object');
      const { multiplier } = dynResults;
      expect(multiplier).to.equal(1000);
      return 3.14 * multiplier;
    });
    const cb = spy((configurator) => {
      expect(configurator).to.be.an('object');
      const { add, entryPoint, once, value, attach, depends } = configurator;
      add('start1', entryPoint(), depends('item1'));
      add('item1', once(item1Factory), attach('multiplier'));
      add('multiplier', value(1000));
    });
    const pm = dynasty(cb);
    expect(pm).to.be.a('promise');
    const results = await pm;
    expect(cb.callCount).to.equal(1);
    expect(results).to.equal(undefined);
    expect(item1Factory.callCount).to.equal(1);
    expect(item1Factory.returnValues[0]).to.equal(3140);
  });
});
