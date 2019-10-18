/**
 * @theroyalwhee0/dynasty:src/members/attach.js
 */

/**
 * Imports.
 */
const { transformDeps } = require('../depends');

/**
 * Attach factory.
 */
function attachFactory() {
  return function attach(...deps) {
    deps = transformDeps(deps);
    function attachParam(item) {
      item.attach = Object.assign(item.attach || { }, deps);
      return Promise.resolve(item);
    };
    return Promise.resolve(attachParam);
  };
}

/**
 * Exports.
 */
module.exports = attachFactory;
