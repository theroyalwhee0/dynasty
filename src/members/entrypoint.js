/**
 * @theroyalwhee0/dynasty:src/members/entrypoint.js
 */

/**
 * Entrypoint factory.
 */
function entryPointFactory(context) {
  return async function entryPoint() {
    return function entryPointParam(item) {
      item.creator = () => {
        return Promise.resolve(undefined);
      };
      context.entryPoints.push(item);
      return item;
    };
  };
}

/**
 * Exports.
 */
module.exports = entryPointFactory;
