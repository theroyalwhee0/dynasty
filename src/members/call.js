/**
 * @theroyalwhee0/dynasty:src/members/call.js
 */

/**
 * Call factory.
 */
function callFactory() {
  return function call(builder) {
    if(typeof builder !== 'function') {
      return Promise.reject(new Error(`"builder" should be a function: ${builder} (${typeof builder})`));
    }
    function callParam(item) {
      item.creator = (dyn) => {
        const args = item.args || [ ];
        const results = builder(...args, dyn);
        return Promise.resolve(results);
      };
      return Promise.resolve(item);
    };
    return Promise.resolve(callParam);
  };
}

/**
 * Exports.
 */
module.exports = callFactory;
