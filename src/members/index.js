/**
 * @file Dynasty, asynchronous dependency injection.
 * @author Adam Mill <hismajesty@theroyalwhee.com>
 * @copyright Copyright 2019-2021 Adam Mill
 * @license Apache-2.0
 */

/**
 * Configurator Member Imports.
 */
const { addFactory } = require('./add');
const { argsFactory } = require('./args');
const { attachFactory } = require('./attach');
const { callFactory } = require('./call');
const { collectFactory } = require('./collect');
const { configFactory } = require('./config');
const { dependsFactory } = require('./depends');
const { entryPointFactory } = require('./entrypoint');
const { extendFactory } = require('./extend');
const { onceFactory } = require('./once');
const { pullMemberFactory } = require('./pullmember');
const { valueFactory } = require('./value');

/**
 * Build a configurator.
 * @param {Object} context The shared Dynasty context.
 * @returns {object} The configurator object.
 */
function configuratorFactory(context) {
  const add = addFactory(context);
  const args = argsFactory(context);
  const attach = attachFactory(context);
  const call = callFactory(context);
  const collect = collectFactory(context);
  const config = configFactory(context);
  const depends = dependsFactory(context);
  const entryPoint = entryPointFactory(context);
  const extend = extendFactory(context);
  const once = onceFactory(context);
  const pullMember = pullMemberFactory(context);
  const value = valueFactory(context);
  return {
    add, args, attach, call, collect,
    config, depends, entryPoint, extend, once,
    pullMember, value,
  };
}

/**
 * Exports.
 */
module.exports = {
  configuratorFactory,
};
