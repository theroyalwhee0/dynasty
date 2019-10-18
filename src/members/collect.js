/**
 * @theroyalwhee0/dynasty:src/members/collect.js
 */

/**
 * Collect factory.
 */
function collectFactory() {
  return function collect() {
    function collectParam(item) {
      item.creator = (dyn) => {
        const collected = Object.assign({}, dyn());
        return Promise.resolve(collected);
      };
      return Promise.resolve(item);
    };
    return Promise.resolve(collectParam);
  };
}

/**
 * Exports.
 */
module.exports = collectFactory;
