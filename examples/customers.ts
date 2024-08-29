import Dynasty from '../src';

/**
 * Customer Example
 * This example demonstrates resolvable records. This allows record values to
 * be Promises or Dependencies.
 */

/**
 * Customer.
 */
type Customer = {
    id: number;
    firstName: string;
    lastName: string;
    zipCode: number;
    lastPurchaseDate: Date;
}

/**
 * Load customer data.
 */
function loadCustomerData(count: number): Customer[] {
    const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie'];
    const lastNames = ['Brown', 'Smith', 'Johnson', 'Williams', 'Jones'];
    const zipCodes = [10001, 19103, 21201, 20008, 30303];
    const customers: Customer[] = [];
    for (let i = 0; i < count; i++) {
        customers.push({
            id: Math.floor(Math.random() * 100_000),
            firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
            lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
            zipCode: zipCodes[Math.floor(Math.random() * zipCodes.length)],
            lastPurchaseDate: new Date(1_420_070_400_000 /* 2015-01-01 */ +
                Math.random() * 300_000_000_000) /* ~10 years */
        });
    }
    return customers;
}

/**
 * Customer data.
 */
const customers = loadCustomerData(4);

/**
 * Log function type.
 */
type Log = (...data: unknown[]) => void;

/**
 * Date format.
 */
const enum DateFormat {
    ISO,
    Timestamp,
    String,
}

/**
 * Application options.
 */
type AppOptions = {
    showId: boolean;
    trim: boolean;
    dateFormat: DateFormat;
    uppercase?: boolean;
};

/**
 * Application factory.
 */
function appFactory(log: Log, options: AppOptions) {
    log('[[[ Customers ]]]');
    for (const customer of customers) {
        const id = customer.id;
        let firstName = customer.firstName;
        let lastName = customer.lastName;
        const zipCode = customer.zipCode;
        let lastPurchaseDate: string;
        // Format date.
        switch (options.dateFormat) {
            case DateFormat.ISO:
                lastPurchaseDate = customer.lastPurchaseDate.toISOString();
                break;
            case DateFormat.Timestamp:
                lastPurchaseDate = (+customer.lastPurchaseDate) + '';
                break;
            case DateFormat.String:
                lastPurchaseDate = customer.lastPurchaseDate.toString();
                break;
            default:
                throw new Error(`Unknown date format '${options.dateFormat}'`);
        }
        if (options.trim) {
            firstName = firstName.trim();
            lastName = lastName.trim();
        }
        if (options.uppercase) {
            firstName = firstName.toUpperCase();
            lastName = lastName.toUpperCase();
        }
        if (options.showId) {
            log(`ID:                    ${id}`);
        }
        log(`First Name:            ${firstName}`);
        log(`Last Name:             ${lastName}`);
        log(`Zip Code:              ${zipCode}`);
        log(`Last Purchase Date:    ${lastPurchaseDate}`);
        log('');
    }
}

/**
 * Main function.
 */
async function main() {
    /**
     * Dynasty instance.
     */
    const dyn = new Dynasty();

    /**
     * Logger.
     */
    const log = dyn.value(console.log);

    /**
     * Show ID option promise.
     */
    const showId = new Promise<boolean>((resolve) => {
        setTimeout(() => resolve(true), 100);
    });

    /**
     * Date format dependency.
     */
    const dateFormat = dyn.value(DateFormat.String);

    /**
     * App options.
     */
    const appOptions = dyn.record<AppOptions>({
        showId, // This is a promise.
        dateFormat, // This is a dependency.
        trim: false, // This is a plain value.
        // uppercase is optional.
    });

    /**
     * Start application.
     */
    const app = dyn.many(appFactory, [log, appOptions]);
    await dyn.start(app);
}

main(); // Call main function.
