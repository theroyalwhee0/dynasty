/**
 * @theroyalwhee0/dynasty:src/index.js
 */

/**
 * General Imports.
 */
const { buildGraph } = require('./depends');
const { getItem } = require('./items');
const { isFunction, isObject } = require('./utilities/istype');

/**
 * Configurator Member Imports.
 */
const addFactory = require('./members/add');
const dependsFactory = require('./members/depends');
const attachFactory = require('./members/attach');
const extendFactory = require('./members/extend');
const pullMemberFactory = require('./members/pullmember');
const entryPointFactory = require('./members/entrypoint');
const argsFactory = require('./members/args');
const onceFactory = require('./members/once');
const callFactory = require('./members/call');
const valueFactory = require('./members/value');
const collectFactory = require('./members/collect');

/**
 * Dynasty factory.
 */
async function dynasty(callback) {
  if(!isFunction(callback)) {
    throw new Error('"callback" must be a function');
  }
  const context = {
    items: { },
    actions: [ ],
    entryPoints: [ ]
  };
  // Configurator members.
  const add = addFactory(context);
  const call = callFactory(context);
  const once = onceFactory(context);
  const value = valueFactory(context);
  const entryPoint = entryPointFactory(context)
  const depends = dependsFactory(context);
  const attach = attachFactory(context);
  const extend = extendFactory(context);
  const args = argsFactory(context);
  const pullMember = pullMemberFactory(context);
  const collect = collectFactory(context);
  // General.
  await callback({
    add,
    call, once, value, entryPoint,
    depends, attach, extend,
    args, pullMember,
    collect,
  });
  // Resolve all the promises we created. We take responsability for
  // chaining the promises we created.
  await Promise.all(context.actions);
  delete context.actions;
  // Put it all together.
  const depGraph = buildGraph(context.items);
  // Start entry points.
  if(context.entryPoints && context.entryPoints.length) {
    const entryPointActions = [ ];
    for(const entryPoint of context.entryPoints) {
      const item = getItem(entryPoint.name, depGraph, context);
      entryPointActions.push(item);
    }
    await Promise.all(entryPointActions);
  }
  delete context.entryPoints;
}

/**
 * Exports.
 */
module.exports = {
  dynasty,
};
