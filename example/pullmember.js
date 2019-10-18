/**
 * Example showing off pullMember and a async once.
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
function reportsFactory() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("> Reports written to 'A:\\reports.txt'");
            return resolve(true);
        }, 1000)
    });
}

/**
 * Main. IIFE.
 */
(async function main() {
    console.log('> Start');
    await dynasty(({ add, once, value, depends, pullMember, attach, entryPoint }) => {
        add('start', entryPoint(), depends('app'));
        add('app',
            once(applicationFactory),
            attach('log'),
            depends('reports')
        );
        add('log',
            pullMember('console', 'info'),
            attach('console')
        );
        add('console', value(console));
        add('reports', once(reportsFactory));
    });
    console.log('> End');
}());
