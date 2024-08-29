import Dynasty, { newable } from '../src';

/**
 * Juicer Example
 * This example demonstrates newable(), a helper function for using classes
 * and interfaces as dependencies.
 */

/**
 * Log function type.
 */
type Log = (...data: unknown[]) => void;

/**
 * Fruit interface.
 */
interface Fruit {
    readonly name: string;
}

/**
 * Favorite interface.
 */
interface Favorite {
    readonly favorite: true;
}

/**
 * Apple class.
 */
class Apple implements Fruit {
    readonly name = 'Apple';
}

/**
 * Pear class.
 */
class Pear implements Fruit {
    readonly name = 'Pear';
}

/**
 * Grape class.
 */
class Grape implements Fruit {
    readonly name = 'Grape';
}

/**
 * Mango class.
 * Also implements Favorite.
 */
class Mango implements Fruit, Favorite {
    readonly name = 'Mango';
    readonly favorite = true;
}

/**
 * The Juicer class.
 */
class Juicer {

    // The fruit to juice.
    private readonly food: Fruit[];

    // The log function.
    private readonly log: Log;

    /**
     * Constructor.
     * @param log The log function.
     * @param food The fruit to juice.
     */
    constructor(log: Log, ...food: Fruit[]) {
        this.log = log;
        this.food = food;
    }

    /**
     * Display the fruits being juiced with an asterisk for favorites.
     */
    process() {
        const juicing = this.food.map((food) => {
            return food.name + ('favorite' in food && food.favorite ? '*' : '');
        });
        this.log(`Juicing ${juicing.join(', ')}`);
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
     * Setup logger.
     */
    const log = dyn.value(console.log);

    /**
     * Use newable to wrap classes in a factory function.
     */
    const apple = dyn.many(newable(Apple), []);
    const mango = dyn.many(newable(Mango), []);

    /**
     * Also available as as a static method.
     */
    const pear = dyn.many(Dynasty.newable(Pear), []);

    /**
     * Alternatively, manually wrap Grape in a factory function.
     * This is simple for classes with no constructor arguments.
     */
    const grape = dyn.many(() => new Grape(), []);

    /**
     * Newable supports the constructor aguments from the wrapped class.
     */
    const juicer = dyn.once(newable(Juicer), [log, grape, apple, pear, mango]);

    /**
     * The chef starts the juicer.
     */
    const chef = dyn.once((log, juicer) => {
        log('[[[ Juicer ]]]');
        juicer.process();
        log();
    }, [log, juicer]);
    await dyn.start(chef);
}

main(); // Call main function.
