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
    private dyn: Dynasty;

    /**
     * Read-only flag.
     */
    private isReadOnly = false;

    /**
     * Constructor.
     * @param initial The initial configuration value. A shallow copy is made.
     */
    constructor(dyn: Readonly<Dynasty>, initial: Readonly<T>) {
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
    readOnly(): Readonly<this> {
        this.isReadOnly = true;
        return this;
    }

    /**
     * Update the configuration.
     * @param partialConfig Partial configuration to merge into the configuration.
     * @returns Fluent interface.
     */
    update(partialConfig: Readonly<Partial<T>>): this {
        if (this.isReadOnly) {
            throw new Error("Unable to modify Dynasty configuration. It has been marked read-only");
        }
        Object.assign<T, Partial<T>>(this.data, partialConfig);
        return this;
    }

    /**
     * Replace the configuration.
     * @param config Full configuration to replace the current configuration with. A shallow copy is made.
     * @returns Fluent interface.
     */
    replace(config: Readonly<T>): this {
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
    select<R>(selector: (config: Readonly<T>) => R): Dependency<R> {
        return this.dyn.many(() => {
            return selector(this.data);
        }, []);
    }

    /**
     * 
     * @param key 
     * @returns 
     */
    get<const K extends keyof T>(key: K): Dependency<T[K]> {
        return this.dyn.many(() => {
            return this.data[key];
        }, []);
    }

    /**
     * Get the entire configuration as a dependency.
     * @returns The dependency for a shallow clone of the configuration.
     */
    all(): Dependency<T> {
        return this.dyn.many(() => {
            return { ...this.data };
        }, []);
    }
}
