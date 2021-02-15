/**
 * @file Dynasty, asynchronous dependency injection.
 * @version v1.0.1
 * @author Adam Mill <hismajesty@theroyalwhee.com>
 * @copyright Copyright 2019-2021 Adam Mill
 * @license Apache-2.0
 */

/**
 * General Imports.
 */
const { isFunction } = require('@theroyalwhee0/istype');
const { buildGraph } = require('./depends');
const { getItem } = require('./items');
const { configuratorFactory } = require('./members/index');

/**
 * Dynasty.
 * @public
 * @param {function} callback The configurator callback were everything is setup.
 * @returns {promise} No results.
 */
async function dynasty(callback) {
  if(!isFunction(callback)) {
    throw new Error('"callback" must be a function');
  }
  const context = {
    actions: {
      config: [],
      add: [],
    },
    config: {},
    items: { },
    entryPoints: [ ],
  };
  // Build configurator.
  const configurator = configuratorFactory(context);
  // General.
  await callback(configurator);
  // Resolve all the promises we created. We take responsability for
  // chaining the promises we created.
  await Promise.all(context.actions.config.concat(context.actions.add));
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
