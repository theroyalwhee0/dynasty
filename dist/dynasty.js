import once from "lodash.once";
import { isDependency, markDependency, resolveDependencies } from "./depends.js";
import { isPromise } from "./helpers.js";
import { Config } from "./config.js";
/**
 * Dynasty is a simple Dependency Injection container.
 */
export class Dynasty {
    /**
     * Create a new Dynasty container.
     * @returns A new Dynasty container.
     */
    static create() {
        return new Dynasty();
    }
    /**
     * Wrap a newable class/function in a factory function.
     * @param factory The newable class/function.
     * @returns A factory function.
     */
    static newable(factory) {
        return (...args) => new factory(...args);
    }
    /**
     * A singleton. Create a dependency that is resolved once.
     * @param factory The factory function.
     * @param depends The dependencies to pass to the factory function.
     * @returns The dependency. Resolved on use.
     */
    once(factory, dependencies) {
        return markDependency(once(async () => {
            return factory(...await resolveDependencies(dependencies));
        }));
    }
    /**
     * Create a dependency that is resolved every time it is used.
     * @param factory The factory function.
     * @param depends The dependencies to pass to the factory function.
     * @returns The dependency. Resolved on use.
     */
    many(factory, dependencies) {
        return markDependency(async () => {
            return factory(...await resolveDependencies(dependencies));
        });
    }
    /**
     * Create a dependency that wraps a value.
     * @param value The value to wrap.
     * @returns The dependency. Resolved on use.
     */
    value(value) {
        return markDependency(() => Promise.resolve(value));
    }
    /**
     * Record dependency.
     * Create a dependency from a record that has resolvable values.
     * The record can contain promises, dependencies, or plain values.
     * @param rec The record to use.
     * @returns The record dependency.
     */
    record(rec) {
        return markDependency(async () => {
            const result = {};
            for (const key in rec) {
                const value = rec[key];
                result[key] =
                    isPromise(value) ? await value
                        : isDependency(value) ? await value()
                            : value;
            }
            // UNSAFE: Force type on UnknownRecord.
            return result;
        });
    }
    /**
     * Configuration.
     * @param initial The initial configuration value.
     * @returns The configuration.
     */
    config(initial) {
        return new Config(this, initial);
    }
    /**
     * Resolve a list of dependencies.
     * @param dependencies A list of dependencies to resolve.
     * @returns The values of the resolved dependencies.
     */
    async start(...dependencies) {
        return resolveDependencies(dependencies);
    }
}
/**
 * Export static utility methods.
 */
export const { newable } = Dynasty;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYXN0eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9keW5hc3R5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sSUFBSSxNQUFNLGFBQWEsQ0FBQztBQUMvQixPQUFPLEVBQThDLFlBQVksRUFBRSxjQUFjLEVBQW9CLG1CQUFtQixFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQy9JLE9BQU8sRUFBRSxTQUFTLEVBQWlCLE1BQU0sY0FBYyxDQUFDO0FBQ3hELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFZckM7O0dBRUc7QUFDSCxNQUFNLE9BQU8sT0FBTztJQUNoQjs7O09BR0c7SUFDSCxNQUFNLENBQUMsTUFBTTtRQUNULE9BQU8sSUFBSSxPQUFPLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILE1BQU0sQ0FBQyxPQUFPLENBQ1YsT0FBK0I7UUFFL0IsT0FBTyxDQUFDLEdBQUcsSUFBVyxFQUFFLEVBQUUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILElBQUksQ0FDQyxPQUE0QixFQUFFLFlBQWlDO1FBQ2hFLE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRTtZQUNsQyxPQUFPLE9BQU8sQ0FBQyxHQUFHLE1BQU0sbUJBQW1CLENBQVEsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUN0RSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsSUFBSSxDQUNDLE9BQTRCLEVBQUUsWUFBaUM7UUFDaEUsT0FBTyxjQUFjLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDN0IsT0FBTyxPQUFPLENBQUMsR0FBRyxNQUFNLG1CQUFtQixDQUFRLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDdEUsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBVSxLQUFRO1FBQ25CLE9BQU8sY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsTUFBTSxDQUNGLEdBQXdCO1FBRXhCLE9BQU8sY0FBYyxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQzdCLE1BQU0sTUFBTSxHQUFrQixFQUFFLENBQUM7WUFDakMsS0FBSyxNQUFNLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztnQkFDcEIsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN2QixNQUFNLENBQUMsR0FBRyxDQUFDO29CQUNQLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLO3dCQUMxQixDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssRUFBRTs0QkFDakMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUN4QixDQUFDO1lBQ0QsdUNBQXVDO1lBQ3ZDLE9BQU8sTUFBNkIsQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsTUFBTSxDQUFnQyxPQUFvQjtRQUN0RCxPQUFPLElBQUksTUFBTSxDQUFJLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxLQUFLLENBQ1AsR0FBRyxZQUE2QjtRQUVoQyxPQUFPLG1CQUFtQixDQUFJLFlBQVksQ0FBQyxDQUFDO0lBQ2hELENBQUM7Q0FDSjtBQUVEOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxPQUFPLENBQUMifQ==