/**
 * Dynasty Configuration.
 * @typeParam T The user supplied configuration record type.
 * @protected
 */
export class Configuration {
    /**
     * The configuration data.
     */
    data;
    /**
     * The parent Dynasty instance.
     */
    dynasty;
    /**
     * Locked flag.
     */
    lockFlag = false;
    /**
     * Constructor.
     * @param initial The initial configuration value. A shallow copy is made.
     */
    constructor(dynasty, initial) {
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
    update(config) {
        if (this.lockFlag) {
            throw new Error('The Dynasty configuration is locked.');
        }
        Object.assign(this.data, config);
        return this;
    }
    /**
     * Replace the configuration.
     * @param config Full configuration to replace the current configuration with. A shallow copy is made.
     * @throws Error if the configuration is locked.
     * @returns Fluent interface.
     */
    replace(config) {
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
    select(selector) {
        return this.dynasty.many(() => {
            return selector(this.data);
        }, []);
    }
    /**
     * Get the configuration value by key.
     * @param key The key of the configuration value. This must be keyof T.
     * @returns
     */
    get(key) {
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
    set(key, value) {
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
    has(key) {
        return key in this.data;
    }
    /**
     * Get the entire configuration as a dependency.
     * @returns The dependency for the entire configuration. A shallow copy is made.
     */
    all() {
        return this.dynasty.many(() => {
            return { ...this.data };
        }, []);
    }
}
//# sourceMappingURL=config.js.map