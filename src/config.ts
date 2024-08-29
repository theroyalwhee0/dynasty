import { Dependency } from "./depends";
import { Dynasty } from "./dynasty";
import { UnknownRecord } from "./helpers";

/**
 * Configuration Selector.
 */
export type Selector<T extends UnknownRecord, R> = (cfg: Readonly<T>) => R


/**
 * Dynasty Configuration.
 */
export class Config<T extends UnknownRecord> {
    /**
     * The configuration data.
     */
    private data: T;

    /**
     * The parent Dynasty instance.
     */
    private dynasty: Dynasty;

    /**
     * Locked flag.
     */
    private lockFlag = false;

    /**
     * Constructor.
     * @param initial The initial configuration value. A shallow copy is made.
     */
    constructor(dynasty: Readonly<Dynasty>, initial: Readonly<T>) {
        this.data = { ...initial };
        this.dynasty = dynasty;
    }

    /**
     * Is the configuration locked?
     */
    get isLocked() {
        return this.lockFlag;
    }

    /**
     * Lock the configuration.
     * Attempts to update the configuration after this will throw.
     * @returns Fluent interface.
     */
    lock() {
        this.lockFlag = true;
        return this;
    }

    /**
     * Unlock the configuration.
     * @returns Fluent interface.
     */
    unlock(): Config<T> {
        this.lockFlag = false;
        return this;
    }

    /**
     * Update the configuration.
     * @param partialConfig Partial configuration to merge into the configuration.
     * @returns Fluent interface.
     */
    update(partialConfig: Readonly<Partial<T>>) {
        if (this.lockFlag) {
            throw new Error('The Dynasty configuration is locked.');
        }
        Object.assign<T, Partial<T>>(this.data, partialConfig);
        return this;
    }

    /**
     * Replace the configuration.
     * @param config Full configuration to replace the current configuration with. A shallow copy is made.
     * @returns Fluent interface.
     */
    replace(config: Readonly<T>) {
        if (this.lockFlag) {
            throw new Error('The Dynasty configuration is locked.');
        }
        this.data = { ...config };
        return this;
    }

    /**
     * Select a configuration value as a dependency using a selector.
     * @param selector The selector function to get the configuration value.
     * @returns The dependency for the configuration value.
     */
    select<R>(selector: (config: Readonly<T>) => R): Dependency<R> {
        return this.dynasty.many(() => {
            return selector(this.data);
        }, []);
    }

    /**
     * Get the configuration value by key.
     * @param key The key of the configuration value. This must be keyof T.
     * @returns 
     */
    get<const K extends keyof T>(key: K): Dependency<T[K]> {
        return this.dynasty.many(() => {
            return this.data[key];
        }, []);
    }

    /**
     * Set a configuration value by key.
     * @param key The key of the configuration value. This must be keyof T.
     * @param value The value to set.
     * @returns Boolean indicating if the value was set.
     */
    set<const K extends keyof T>(key: K, value: T[K]) {
        if (this.lockFlag) {
            throw new Error('The Dynasty configuration is locked.');
        }
        this.data[key] = value;
        return this;
    }

    /**
     * Does the configuration have a given key?
     * @param key The key to check.
     * @returns True if the key exists in the configuration.
     */
    has<const K extends keyof T>(key: K): boolean {
        return key in this.data;
    }

    /**
     * Get the entire configuration as a dependency.
     * @returns The dependency for the entire configuration. A shallow copy is made.
     */
    all(): Dependency<T> {
        return this.dynasty.many(() => {
            return { ...this.data };
        }, []);
    }
}
