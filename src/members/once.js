/**
 * @theroyalwhee0/dynasty:src/members/once.js
 */

/**
 * Imports.
 */
const UNSET = require('../unset');
const { isFunction } = require('@theroyalwhee0/istype');

/**
 * Once factory.
 */
function onceFactory() {
  return async function once(builder) {
    if(!isFunction(builder)) {
      throw new Error(`"builder" should be a function: "${builder}" (${typeof builder})`);
    }
    return function onceParam(item) {
      let result = UNSET;
      item.creator = (dyn) => {
        if(result === UNSET) {
          const args = item.args || [ ];
          try {
            result = Promise.resolve(builder(...args, dyn));
          } catch(ex) {
            result = Promise.reject(ex);
          }
        }
        return result;
      };
      return item;
    };
  };
}

/**
 * Exports.
 */
module.exports = onceFactory;
