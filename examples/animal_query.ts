import Dynasty from '../src';

/**
 * Animal Query Example
 * This example demonstrates a simple application that queries a
 * toy data store for a value. It has a logger, hard coded data, 
 * a data store, and an application that queries the data store.
 */

/**
 * Hardcoded query value.
 * Case insensitive.
 */
const query = 'gar';

/**
 * A simple logging function.
 * @param value The values to log.
 */
function loggerFactory() {
    return (...value: unknown[]) => console.log(...value);
}

/**
 * Logger type.
 */
type Log = ReturnType<typeof loggerFactory>;

/**
 * Application factory.
 * @param log Logger.
 * @param data Queryable data store.
 */
function appFactory(log: Log, data: Queryable) {
    log('[[[ Animal Lookup ]]]');
    log(`> Querying data for "${query}"`);
    const animal = data.query(query);
    log(`> Found "${animal}"`);
    log();
}

/**
 * Data factory.
 * @returns A promise that resolves to the data.
 */
function dataFactory(): Promise<Record<string, string>> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "APE": "primates",
                "BEE": "hymenoptera",
                "CAT": "carnivora",
                "DOG": "carnivora",
                "EEL": "anguilliformes",
                "FIR": "pinales",
                "GAR": "lepisosteiformes",
            });
        }, 200); // 200ms delay
    });
}

/**
 * A simple data store.
 */
interface Queryable {
    query(value: string): string
};

/**
 * Queryable data store.
 * @param data The data to use.
 * @returns The query result.
 */
function queryFactory(data: Record<string, string>) {
    return {
        query(value: string) {
            const key = value.toUpperCase();
            if (key in data) {
                return data[key];
            } else {
                return "unknown"; // Not found
            }
        }
    }
}

/**
 * Main function.
 */
async function main() {
    const dyn = new Dynasty();
    const log = dyn.once(loggerFactory, []);
    const data = dyn.once(dataFactory, []);
    const queryable = dyn.once(queryFactory, [data]);
    const app = dyn.once(appFactory, [log, queryable]);
    await dyn.start(app);
}

main(); // Call main function.
