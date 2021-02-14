/**
 * Example showing off basic entryPoint, once, depends, and attach.
 */

/**
 * Imports.
 */
const { dynasty } = require('../src');

/**
 * Application factory.
 */
function applicationFactory(dyn) {
  const { log } = dyn();
  log('> Application started');
  return {
    'name': 'This is the application',
  };
}

/**
 * Reports factory.
 */
function logFactory() {
  return function log(...args) {
    console.log(...args);
  };
}

/**
 * Main. IIFE.
 */
(async function main() {
  console.log('> Start');
  await dynasty(({ add, once, depends, attach, entryPoint }) => {
    add('start', entryPoint(), depends('app'));
    add('app',
      once(applicationFactory),
      attach('log')
    );
    add('log', once(logFactory));
  });
  console.log('> End');
}());
