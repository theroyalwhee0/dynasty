/**
 * @theroyalwhee0/dynasty:test/items.spec.js
 */

/**
 * Imports.
 */
const { describe, it, expect } = require('./testing');
const { getItem, getConfigItem } = require('../src/items');
const { mockDepends } = require('./mocks/general.js');
const { mockCreator, mockCoreContext } = require('./mocks/members');

/**
 * Test.
 */
describe('dynasty', () => {
  describe('items', () => {
    describe('getConfigItem', () => {
      it('should be a function', () => {
        expect(getConfigItem).to.be.a('function');
        expect(getConfigItem.length).to.equal(2);
      });
      it('should resolve entire config object', () => {
        const context = mockCoreContext();
        context.config.a = 1;
        const [ name, item ] = getConfigItem('$cfg', context);
        expect(name).to.equal('cfg');
        expect(item).to.be.an('object');
        expect(item).to.eql(context.config);
      });
      it('should resolve simple config path', () => {
        const context = mockCoreContext();
        Object.assign(context.config, { a: 1, b: 2 });
        const [ name, item ] = getConfigItem('$key=a', context);
        expect(name).to.equal('key');
        expect(item).to.equal(1);
      });
      it('should resolve deep config path', () => {
        const context = mockCoreContext();
        Object.assign(context.config, {
          a: 1,
          b: {
            c: 3,
            d: 4,
          },
        });
        const [ name, item ] = getConfigItem('$key=b.d', context);
        expect(name).to.equal('key');
        expect(item).to.equal(4);
      });
      it('should resolve complex config path', () => {
        const context = mockCoreContext();
        Object.assign(context.config, {
          a: 1,
          b: {
            c: [
              { d: 4, e: 5 },
              { d: 6, e: 7 },
              { d: 8, e: 9 },
              { d: 10, e: 11 },
              { d: 12, e: 13 },
              { d: 14, e: 15 },
            ],
          },
        });
        const [ name, item ] = getConfigItem('$$name=b.c..d', context);
        expect(name).to.equal('name');
        expect(item).to.eql([ 4, 6, 8, 10, 12, 14 ]);
      });
    });
    describe('getItem', () => {
      it('should be a function', () => {
        expect(getItem).to.be.a('function');
        expect(getItem.length).to.equal(3);
      });
      it('should get and resolve an item with dependencies', async () => {
        const name1 = 'apple';
        const name2 = 'orange';
        const context = mockCoreContext();
        Object.assign(context.items, {
          [name1]: { creator: mockCreator(1), attach: { [name2]: name2 } },
          [name2]: { creator: mockCreator(2) },
        });
        const depGraph = mockDepends({
          [name2]: [],
          [name1]: [name2],
        });
        const pm = getItem(name1, depGraph, context);
        expect(pm).to.be.a('promise');
        const item = await pm;
        expect(item).to.be.a('function');
        const obj = { };
        const results = item(obj);
        expect(results).to.be.an('object');
        expect(results[name2]).to.be.a('function');
        expect(Object.keys(results)).to.eql(Object.keys(obj));
      });
      it('should handle config keys', async () => {
        const name1 = 'apple';
        const name2 = 'orange';
        const context = mockCoreContext();
        Object.assign(context, { a: 1 });
        Object.assign(context.items, {
          [name1]: {
            creator: mockCreator(1),
            attach: {
              '$a=a': true,
              [name2]: name2,
            },
          },
          [name2]: { creator: mockCreator(2) },
        });
        const depGraph = mockDepends({
          [name2]: [],
          [name1]: [name2],
        });
        const pm = getItem(name1, depGraph, context);
        expect(pm).to.be.a('promise');
        const item = await pm;
        expect(item).to.be.a('function');
        const obj = { };
        const results = item(obj);
        expect(results).to.be.an('object');
        expect(results[name2]).to.be.a('function');
        expect(Object.keys(results)).to.eql(Object.keys(obj));
      });
    });
  });
});
