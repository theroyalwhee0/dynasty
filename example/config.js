/**
 * Example showing off config and attach.
 */

/**
 * Imports.
 */
const { dynasty } = require('../src');

/**
 * Application factory.
 */
function applicationFactory(dyn) {
  const { log, toy } = dyn();
  log(`> Doggo toy is a '${toy}'`);
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
  await dynasty(({ add, once, depends, attach, entryPoint, config }) => {
    config({
      dog: {
        play: {
          toy: 'squeaker',
        },
        eat: {
          foot: 'treat',
        },
        sleep: 'wherever',
      },
    });
    add('start', entryPoint(), depends('app'));
    add('app',
      once(applicationFactory),
      attach('log', '$toy=dog.play.toy') // This is a jsonpath.
    );
    add('log', once(logFactory));
  });
  console.log('> End');
}());
