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
  const { log, toy, drink } = dyn();
  log(`> Doggo toy is a '${toy}'`);
  log(`> Doggo drinks from a '${drink}'`);
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
  console.log('> This will wait a moment to simulate async config load.');
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
    config(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            dog: {
              drink: {
                from: 'bowl',
              },
            },
          });
        }, 1000);
      });
    });
    add('start', entryPoint(), depends('app'));
    add('app',
      once(applicationFactory),
      attach('log', '$toy=dog.play.toy', '$drink=dog.drink.from') // This is a jsonpath.
    );
    add('log', once(logFactory));
  });
  console.log('> End');
}());
