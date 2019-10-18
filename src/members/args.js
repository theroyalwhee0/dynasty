/**
 * @theroyalwhee0/dynasty:src/members/args.js
 */

/**
 * Args factory.
 */
function argsFactory() {
  return function args(...argList) {
    function argsParam(item) {
      item.args = (item.args || [ ]).concat(argList);
      return Promise.resolve(item);
    };
    return Promise.resolve(argsParam);
  };
}

/**
 * Exports.
 */
module.exports = argsFactory;
