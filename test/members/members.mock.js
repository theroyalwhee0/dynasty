/**
 * @theroyalwhee0/dynasty:test/members/members.mock.js
 */

/**
 * Imports.
 */
const { spy } = require('sinon');
const addFactory = require('../../src/members/add');

/**
 * Mock Core Context.
 */
function mockCoreContext() {
  return {
    entryPoints: [ ],
    actions: [ ],
    items: { },
  };
}

/**
 * Mock Creator.
 */
function mockCreator() {
  return spy(function creator(item) {
    item.creator = () => { };
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
