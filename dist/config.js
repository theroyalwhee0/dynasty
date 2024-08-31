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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUF5RkE7Ozs7R0FJRztBQUNILE1BQU0sT0FBTyxhQUFhO0lBQ3RCOztPQUVHO0lBQ0ssSUFBSSxDQUFJO0lBRWhCOztPQUVHO0lBQ0ssT0FBTyxDQUFVO0lBRXpCOztPQUVHO0lBQ0ssUUFBUSxHQUFHLEtBQUssQ0FBQztJQUV6Qjs7O09BR0c7SUFDSCxZQUFZLE9BQTBCLEVBQUUsT0FBb0I7UUFDeEQsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLEdBQUcsT0FBTyxFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDM0IsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBSSxRQUFRO1FBQ1IsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsSUFBSTtRQUNBLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxNQUFNO1FBQ0YsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDdEIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLE1BQTRCO1FBQy9CLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQztRQUM1RCxDQUFDO1FBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBZ0IsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxPQUFPLENBQUMsTUFBbUI7UUFDdkIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1FBQzVELENBQUM7UUFDRCxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxNQUFNLEVBQUUsQ0FBQztRQUMxQixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILE1BQU0sQ0FBSSxRQUF3QjtRQUM5QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUMxQixPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxHQUFHLENBQTBCLEdBQU07UUFDL0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDMUIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNYLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxHQUFHLENBQTBCLEdBQU0sRUFBRSxLQUFXO1FBQzVDLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQztRQUM1RCxDQUFDO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDdkIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxHQUFHLENBQTBCLEdBQU07UUFDL0IsT0FBTyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQztJQUM1QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsR0FBRztRQUNDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQzFCLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM1QixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDWCxDQUFDO0NBQ0oifQ==