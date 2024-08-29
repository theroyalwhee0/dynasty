/**
 * Dynasty Configuration.
 */
export class Config {
    /**
     * The configuration data.
     */
    data;
    /**
     * The parent Dynasty instance.
     */
    dyn;
    /**
     * Read-only flag.
     */
    isReadOnly = false;
    /**
     * Constructor.
     * @param initial The initial configuration value. A shallow copy is made.
     */
    constructor(dyn, initial) {
        this.data = { ...initial };
        this.dyn = dyn;
    }
    /**
     * Mark the configuration as read-only.
     * @returns Fluent interface.
     */
    readOnly(value = true) {
        this.isReadOnly = value;
        return this;
    }
    /**
     * Update the configuration.
     * @param partialConfig Partial configuration to merge into the configuration.
     * @returns Fluent interface.
     */
    update(partialConfig) {
        if (this.isReadOnly) {
            throw new Error("Unable to modify Dynasty configuration. It has been marked read-only");
        }
        Object.assign(this.data, partialConfig);
        return this;
    }
    /**
     * Replace the configuration.
     * @param config Full configuration to replace the current configuration with. A shallow copy is made.
     * @returns Fluent interface.
     */
    replace(config) {
        if (this.isReadOnly) {
            throw new Error("Unable to modify Dynasty configuration. It has been marked read-only");
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
        return this.dyn.many(() => {
            return selector(this.data);
        }, []);
    }
    /**
     * Get the configuration value by key.
     * @param key The key of the configuration value. This must be keyof T.
     * @returns
     */
    get(key) {
        return this.dyn.many(() => {
            return this.data[key];
        }, []);
    }
    /**
     * Set a configuration value by key.
     * @param key The key of the configuration value. This must be keyof T.
     * @param value The value to set.
     * @returns Boolean indicating if the value was set.
     */
    set(key, value) {
        if (this.isReadOnly) {
            throw new Error("Unable to modify Dynasty configuration. It has been marked read-only");
        }
        this.data[key] = value;
        return this;
    }
    /**
     * Does the configuration have a given key?
     * @param key The key to check.
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
        return this.dyn.many(() => {
            return { ...this.data };
        }, []);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFVQTs7R0FFRztBQUNILE1BQU0sT0FBTyxNQUFNO0lBQ2Y7O09BRUc7SUFDSyxJQUFJLENBQUk7SUFFaEI7O09BRUc7SUFDSyxHQUFHLENBQVU7SUFFckI7O09BRUc7SUFDSyxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBRTNCOzs7T0FHRztJQUNILFlBQVksR0FBc0IsRUFBRSxPQUFvQjtRQUNwRCxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxPQUFPLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUNuQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsUUFBUSxDQUFDLEtBQUssR0FBRyxJQUFJO1FBQ2pCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsTUFBTSxDQUFDLGFBQW1DO1FBQ3RDLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQUMsc0VBQXNFLENBQUMsQ0FBQztRQUM1RixDQUFDO1FBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBZ0IsSUFBSSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztRQUN2RCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILE9BQU8sQ0FBQyxNQUFtQjtRQUN2QixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNsQixNQUFNLElBQUksS0FBSyxDQUFDLHNFQUFzRSxDQUFDLENBQUM7UUFDNUYsQ0FBQztRQUNELElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxHQUFHLE1BQU0sRUFBRSxDQUFDO1FBQzFCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsTUFBTSxDQUFJLFFBQW9DO1FBQzFDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ3RCLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEdBQUcsQ0FBMEIsR0FBTTtRQUMvQixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUN0QixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsR0FBRyxDQUEwQixHQUFNLEVBQUUsS0FBVztRQUM1QyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNsQixNQUFNLElBQUksS0FBSyxDQUFDLHNFQUFzRSxDQUFDLENBQUM7UUFDNUYsQ0FBQztRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsR0FBRyxDQUEwQixHQUFNO1FBQy9CLE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDNUIsQ0FBQztJQUVEOzs7T0FHRztJQUNILEdBQUc7UUFDQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUN0QixPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDNUIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztDQUNKIn0=