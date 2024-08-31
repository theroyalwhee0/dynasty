import { Dependency } from './depends';
import { Dynasty } from './dynasty';
import { UnknownRecord } from './helpers';

/**
 * Configuration Selector.
 * Used with the {@link Config#select} method to get a configuration value as a dependency.
 * @typeParam T The configuration type.
 * @typeParam R The return type.
 */
export type Selector<T extends UnknownRecord, R> = (cfg: T) => R


/**
 * Config interface.
 * Instances are returned by the {@link Dynasty#config} method.
 * @typeParam T The user supplied configuration record type.
 * @public
 */
export interface Config<T extends Readonly<UnknownRecord>> {
    /**
     * Is the configuration locked?
     */
    get isLocked(): boolean;

    /**
     * Lock the configuration.
     * Attempts to update the configuration after this will throw.
     * @returns Fluent interface.
     */
    lock(): this;

    /**
     * Unlock the configuration.
     * @returns Fluent interface.
     */
    unlock(): this;

    /**
     * Update the configuration.
     * @param config Partial configuration to merge into the configuration.
     * @returns Fluent interface.
     */
    update(config: Readonly<Partial<T>>): this;

    /**
     * Replace the configuration.
     * @param config Full configuration to replace the current configuration with. A shallow copy is made.
     * @returns Fluent interface.
     */
    replace(config: Readonly<T>): this;

    /**
     * Select a configuration value as a dependency using a selector.
     * @param selector The selector function to get the configuration value.
     * @typeParam R The return type from the selector.
     * @returns The dependency for the configuration value.
     */
    select<R>(selector: Selector<T, R>): Dependency<Readonly<R>>;

    /**
     * Get the configuration value by key.
     * @param key The key of the configuration value. This must be keyof T.
     * @returns 
     */
    get<const K extends keyof T>(key: K): Dependency<Readonly<T[K]>>;

    /**
     * Set a configuration value by key.
     * @param key The key of the configuration value. This must be keyof T.
     * @param value The value to set.
     * @returns Boolean indicating if the value was set.
     */
    set<const K extends keyof T>(key: K, value: T[K]): this;

    /**
     * Does the configuration have a given key?
     * @param key The key to check. This must be keyof T.
     * @returns True if the key exists in the configuration.
     */
    has<const K extends keyof T>(key: K): boolean;

    /**
     * Get the entire configuration as a dependency.
     * @returns The dependency for the entire configuration. A shallow copy is made.
     */
    all(): Dependency<T>;
}

/**
 * Dynasty Configuration.
 * @typeParam T The user supplied configuration record type.
 * @protected
 */
export class Configuration<T extends UnknownRecord> implements Config<T> {
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
    unlock() {
        this.lockFlag = false;
        return this;
    }

    /**
     * Update the configuration.
     * @param config Partial configuration to merge into the configuration.
     * @throws Error if the configuration is locked.
     * @returns Fluent interface.
     */
    update(config: Readonly<Partial<T>>) {
        if (this.lockFlag) {
            throw new Error('The Dynasty configuration is locked.');
        }
        Object.assign<T, Partial<T>>(this.data, config);
        return this;
    }

    /**
     * Replace the configuration.
     * @param config Full configuration to replace the current configuration with. A shallow copy is made.
     * @throws Error if the configuration is locked.
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
    select<R>(selector: Selector<T, R>): Dependency<Readonly<R>> {
        return this.dynasty.many(() => {
            return selector(this.data);
        }, []);
    }

    /**
     * Get the configuration value by key.
     * @param key The key of the configuration value. This must be keyof T.
     * @returns 
     */
    get<const K extends keyof T>(key: K): Dependency<Readonly<T[K]>> {
        return this.dynasty.many(() => {
            return this.data[key];
        }, []);
    }

    /**
     * Set a configuration value by key.
     * @param key The key of the configuration value. This must be keyof T.
     * @param value The value to set.
     * @throws Error if the configuration is locked.
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
     * @param key The key to check.  This must be keyof T.
     * @returns True if the key exists in the configuration.
     */
    has<const K extends keyof T>(key: K): boolean {
        return key in this.data;
    }

    /**
     * Get the entire configuration as a dependency.
     * @returns The dependency for the entire configuration. A shallow copy is made.
     */
    all(): Dependency<Readonly<T>> {
        return this.dynasty.many(() => {
            return { ...this.data };
        }, []);
    }
}
