/**
 * @theroyalwhee0/dynasty:src/utilities/promises.js
 */

/**
 * Like Promise.all over an object.
 * @method allOfObject
 * @param  {Object<Any:Promise>}    promises An object of promises to resolve.
 * @return {Promise<Object<Any:Any>>}            Promise resolving to results of all the promises.
 */
async function allOfObject(promises) {
  if(!(promises && typeof promises === 'object')) {
    throw new Error(`"promises" must be an object`);
  }
  const keys = Object.keys(promises);
  const values = Object.values(promises);
  const results = await Promise.all(values);
  return keys.reduce((mapped, key, idx) => {
    mapped[key] = results[idx];
    return mapped;
  }, {});
}
  
/**
 * Exports.
 */
module.exports = {
  allOfObject,
};
