import Dynasty from "../src";

/**
 * Character Sheet Example
 * This example demonstrates many(), dependency tuples, and dependency factories.
 * It creates a set of reusable dice dependencies, a generic adder dependency,
 * and groups the ability scores into a tuple.
 */

/**
 * Roll a specified sided dice a specified number of times.
 * @param count The number of times to roll the dice.
 * @param sides The number of sides on the dice.
 * @returns A random number within the range specified by the dice.
 */
function roll(count: number, sides: number): number {
    let total = 0;
    for (let idx = 0; idx < count; idx++) {
        total += Math.floor(Math.random() * sides) + 1;
    }
    return total;
}

/**
 * Add the given values together.
 * @param values The values to add together.
 * @returns The sum of the given values.
 */
function add(...values: number[]): number {
    return values.reduce((a, b) => a + b, 0);
}

/**
 * Main function.
 */
async function main() {
    const dyn = new Dynasty();

    /**
     * Setup logger.
     */
    const log = dyn.value(console.log);
    type Log = (...data: unknown[]) => void;

    /**
     * Get a bonus based on the given ability score.
     */
    const getBonus = dyn.value((value: number) => Math.floor((Math.abs(value - 10)) / 2) * (value < 10 ? -1 : 1));

    /**
     * Format a bonus for display.
     */
    const showBonus = dyn.once((getBonus: (value: number) => number) => {
        return (value: number) => {
            const bonus = getBonus(value);
            return bonus === 0 ? '' : `[${bonus > 0 ? '+' : ''}${bonus}]`;
        }
    }, [getBonus]);

    /**
     * Define dice.
     * Inclues a full set of dice, but only uses d6 and d10.
     */
    const _coin = dyn.many(() => roll(1, 2), []);
    const _d4 = dyn.many(() => roll(1, 4), []);
    const d6 = dyn.many(() => roll(1, 6), []);
    const _d8 = dyn.many(() => roll(1, 8), []);
    const d10 = dyn.many(() => roll(1, 10), []);
    const _d12 = dyn.many(() => roll(1, 12), []);
    const _d20 = dyn.many(() => roll(1, 20), []);
    const _d100 = dyn.many(() => roll(1, 100), []);

    /**
     * Bonus and penalty functions.
     * Note, these are not Dependencies, but factories that build Dependencies.
     */
    const bonus = (value: number) => dyn.value(value);
    const penalty = (value: number) => dyn.value(-value);

    /**
     * Ability scores.
     */
    const strength = dyn.once(add, [d6, d6, d6]);
    const consitution = dyn.once(add, [d6, d6, d6, bonus(2)]);
    const dexterity = dyn.once(add, [d6, d6, d6,]);
    const intelligence = dyn.once(add, [d6, d6, d6]);
    const wisdom = dyn.once(add, [d6, d6, d6]);
    const charisma = dyn.once(add, [d6, d6, d6, penalty(2)]);
    const abilityScores = [strength, consitution, dexterity, intelligence, wisdom, charisma] as const;

    /**
     * Other stats.
     */
    const hitpoints = dyn.once(add, [d10]);

    /**
     * Character sheet.
     */
    const sheet = dyn.once((
        log: Log,
        getBonus: (value: number) => number,
        showBonus: (value: number) => string,
        hitpoints: number,
        str: number,
        con: number,
        dex: number,
        int: number,
        wis: number,
        chr: number,
    ) => {
        log('[[[ Character Sheet ]]]');
        log('Name: __________________________');
        log('Class: Warrior');
        log('Race: Northfolk');
        log();
        log('Ability Scores');
        log(` Strength: ${str}\t\t${showBonus(str)}`);
        log(` Constitution: ${con}\t${showBonus(con)}`);
        log(` Dexterity: ${dex}\t\t${showBonus(dex)}`);
        log(` Intelligence: ${int}\t${showBonus(int)}`);
        log(` Wisdom: ${wis}\t\t${showBonus(wis)}`);
        log(` Charisma: ${chr}\t\t${showBonus(chr)}`);
        log();
        log(`Hit Points: ${Math.max(hitpoints + getBonus(con), 1)}\t\t${showBonus(con)}`);
        log(`Armor Class: ${10 + getBonus(dex)}\t\t${showBonus(dex)}`);
        log();
    }, [log, getBonus, showBonus, hitpoints, ...abilityScores]);

    /**
     * Start.
     */
    await dyn.start(sheet);
}

main(); // Call main function.
