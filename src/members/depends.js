/**
 * @theroyalwhee0/dynasty:src/members/depends.js
 */

/**
 * Imports.
 */
const { transformDeps } = require('../depends');

/**
 * Depends factory.
 */
function dependsFactory() {
  return function depends(...deps) {
    deps = transformDeps(deps);
    function dependsParam(item) {
      item.depends = Object.assign(item.depends || { }, deps);
      return Promise.resolve(item);
    };
    return Promise.resolve(dependsParam);
  };
}

/**
 * Exports.
 */
module.exports = dependsFactory;
