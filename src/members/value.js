/**
 * @theroyalwhee0/dynasty:src/members/value.js
 */

/**
 * Value factory.
 */
function valueFactory() {
  return async function value(contents) {
    if(arguments.length === 0) {
      throw new Error('"contents" is required');
    }
    return function valueParam(item) {
      item.creator = async () => {
        if(item.args && item.args.length > 0) {
          throw new Error('"value" creator does not support "args" property.');
        }
        return contents;
      };
      return item;
    };
  };
}

/**
 * Exports.
 */
module.exports = valueFactory;
