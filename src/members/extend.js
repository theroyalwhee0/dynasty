/**
 * @theroyalwhee0/dynasty:src/members/extend.js
 */

/**
 * Extend factory.
 */
function extendFactory() {
  return function extend(props) {
    function extendParam(item) {
      item.extend = Object.assign(item.extend || { }, props);
      return Promise.resolve(item);
    };
    return Promise.resolve(extendParam);
  };
}

/**
 * Exports.
 */
module.exports = extendFactory;
