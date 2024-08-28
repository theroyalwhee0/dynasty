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
        if (typeof initial !== "object") {
            throw new Error(`Configuration must be an object was '${typeof initial}'.`);
        }
        this.data = { ...initial };
        this.dyn = dyn;
    }
    /**
     * Mark the configuration as read-only.
     * @returns Fluent interface.
     */
    readOnly() {
        this.isReadOnly = true;
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
     *
     * @param key
     * @returns
     */
    get(key) {
        return this.dyn.many(() => {
            return this.data[key];
        }, []);
    }
    /**
     * Get the entire configuration as a dependency.
     * @returns The dependency for a shallow clone of the configuration.
     */
    all() {
        return this.dyn.many(() => {
            return { ...this.data };
        }, []);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFVQTs7R0FFRztBQUNILE1BQU0sT0FBTyxNQUFNO0lBQ2Y7O09BRUc7SUFDSyxJQUFJLENBQUk7SUFFaEI7O09BRUc7SUFDSyxHQUFHLENBQVU7SUFFckI7O09BRUc7SUFDSyxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBRTNCOzs7T0FHRztJQUNILFlBQVksR0FBc0IsRUFBRSxPQUFvQjtRQUNwRCxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRSxDQUFDO1lBQzlCLE1BQU0sSUFBSSxLQUFLLENBQUMsd0NBQXdDLE9BQU8sT0FBTyxJQUFJLENBQUMsQ0FBQztRQUNoRixDQUFDO1FBQ0QsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLEdBQUcsT0FBTyxFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDbkIsQ0FBQztJQUVEOzs7T0FHRztJQUNILFFBQVE7UUFDSixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN2QixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILE1BQU0sQ0FBQyxhQUFtQztRQUN0QyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNsQixNQUFNLElBQUksS0FBSyxDQUFDLHNFQUFzRSxDQUFDLENBQUM7UUFDNUYsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQWdCLElBQUksQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDdkQsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxPQUFPLENBQUMsTUFBbUI7UUFDdkIsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDbEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxzRUFBc0UsQ0FBQyxDQUFDO1FBQzVGLENBQUM7UUFDRCxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxNQUFNLEVBQUUsQ0FBQztRQUMxQixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILE1BQU0sQ0FBSSxRQUFvQztRQUMxQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUN0QixPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxHQUFHLENBQTBCLEdBQU07UUFDL0IsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDdEIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNYLENBQUM7SUFFRDs7O09BR0c7SUFDSCxHQUFHO1FBQ0MsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDdEIsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzVCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNYLENBQUM7Q0FDSiJ9