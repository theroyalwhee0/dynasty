/**
 * @theroyalwhee0/dynasty:src/members/pullmember.js
 */

/**
 * Imports.
 */
const { isFunction, canHaveMembers } = require('@theroyalwhee0/istype');

/**
 * Pull Member factory.
 */
function pullMemberFactory() {
  return function pullMember(name, member, { bind=true }={}) {
    function pullMemberParam(item) {
      item.creator = (dyn) => {
        const attached = dyn();
        if(!(name in attached)) {
          return Promise.reject(new Error(`node "${name}" not attached`));
        }
        const item = attached[name];
        if(!canHaveMembers(item)) {
          return Promise.reject(new Error(`node "${name}" can not have members`));
        }
        if(!(member in item)) {
          return Promise.reject(new Error(`node "${name}" does not have a member "${member}"`));
        }
        const property = item[member];
        let results;
        if(bind && isFunction(property)) {
          // If it is a function then bind it.
          results = property.bind(item);
        } else {
          results = property;
        }
        return Promise.resolve(results);
      };
      return Promise.resolve(item);
    };
    return Promise.resolve(pullMemberParam);
  };
}

/**
 * Exports.
 */
module.exports = pullMemberFactory;
