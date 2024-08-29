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
     * @param partialConfig Partial configuration to merge into the configuration.
     * @returns Fluent interface.
     */
    update(partialConfig) {
        if (this.lockFlag) {
            throw new Error('The Dynasty configuration is locked.');
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
        return this.dynasty.many(() => {
            return { ...this.data };
        }, []);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFVQTs7R0FFRztBQUNILE1BQU0sT0FBTyxNQUFNO0lBQ2Y7O09BRUc7SUFDSyxJQUFJLENBQUk7SUFFaEI7O09BRUc7SUFDSyxPQUFPLENBQVU7SUFFekI7O09BRUc7SUFDSyxRQUFRLEdBQUcsS0FBSyxDQUFDO0lBRXpCOzs7T0FHRztJQUNILFlBQVksT0FBMEIsRUFBRSxPQUFvQjtRQUN4RCxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxPQUFPLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUMzQixDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFJLFFBQVE7UUFDUixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDekIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxJQUFJO1FBQ0EsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7T0FHRztJQUNILE1BQU07UUFDRixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUN0QixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILE1BQU0sQ0FBQyxhQUFtQztRQUN0QyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNoQixNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7UUFDNUQsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQWdCLElBQUksQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDdkQsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxPQUFPLENBQUMsTUFBbUI7UUFDdkIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1FBQzVELENBQUM7UUFDRCxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxNQUFNLEVBQUUsQ0FBQztRQUMxQixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILE1BQU0sQ0FBSSxRQUFvQztRQUMxQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUMxQixPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxHQUFHLENBQTBCLEdBQU07UUFDL0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDMUIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNYLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEdBQUcsQ0FBMEIsR0FBTSxFQUFFLEtBQVc7UUFDNUMsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1FBQzVELENBQUM7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUN2QixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEdBQUcsQ0FBMEIsR0FBTTtRQUMvQixPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzVCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxHQUFHO1FBQ0MsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDMUIsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzVCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNYLENBQUM7Q0FDSiJ9