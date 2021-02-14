/**
 * @theroyalwhee0/dynasty:test/mock/members.js
 */

/**
 * Imports.
 */
const { spy } = require('../testing');
const { addFactory } = require('../../src/members/add');

/**
 * Mock Core Context.
 */
function mockCoreContext() {
  return {
    config: { },
    actions: [ ],
    config: { },
    entryPoints: [ ],
    items: { },
  };
}

/**
 * Mock Creator.
 */
function mockCreator(value) {
  return spy(function creator(item) {
    item.creator = (_dyn) => {
      return [value];
    };
    return Promise.resolve(item);
  });
}

/**
 * Mock Add.
 */
function mockAdd(context) {
  const add = addFactory(context);
  return spy(add);
}

/**
 * Mock Param.
 */
function mockParam(cb) {
  return spy((item) => {
    let results;
    if(cb) {
      results = cb(item);
    }
    return results === undefined ? item : results;
  });
}

/**
 * Exports.
 */
module.exports = {
  mockAdd, mockCreator, mockCoreContext, mockParam,
};
