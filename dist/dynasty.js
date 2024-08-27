import once from "lodash.once";
import { isDependency, markDependency, resolveDependencies } from "./depends.js";
import { isPromise } from "./helpers.js";
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
            // UNSAFE: Force type on generic Record.
            return result;
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYXN0eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9keW5hc3R5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sSUFBSSxNQUFNLGFBQWEsQ0FBQztBQUMvQixPQUFPLEVBQThDLFlBQVksRUFBRSxjQUFjLEVBQW9CLG1CQUFtQixFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQy9JLE9BQU8sRUFBRSxTQUFTLEVBQWlCLE1BQU0sY0FBYyxDQUFDO0FBWXhEOztHQUVHO0FBQ0gsTUFBTSxPQUFPLE9BQU87SUFDaEI7OztPQUdHO0lBQ0gsTUFBTSxDQUFDLE1BQU07UUFDVCxPQUFPLElBQUksT0FBTyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsT0FBTyxDQUNWLE9BQStCO1FBRS9CLE9BQU8sQ0FBQyxHQUFHLElBQVcsRUFBRSxFQUFFLENBQUMsSUFBSSxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxJQUFJLENBQ0MsT0FBNEIsRUFBRSxZQUFpQztRQUNoRSxPQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDbEMsT0FBTyxPQUFPLENBQUMsR0FBRyxNQUFNLG1CQUFtQixDQUFRLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDdEUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNSLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILElBQUksQ0FDQyxPQUE0QixFQUFFLFlBQWlDO1FBQ2hFLE9BQU8sY0FBYyxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQzdCLE9BQU8sT0FBTyxDQUFDLEdBQUcsTUFBTSxtQkFBbUIsQ0FBUSxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQVUsS0FBUTtRQUNuQixPQUFPLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILE1BQU0sQ0FDRixHQUF3QjtRQUV4QixPQUFPLGNBQWMsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUM3QixNQUFNLE1BQU0sR0FBa0IsRUFBRSxDQUFDO1lBQ2pDLEtBQUssTUFBTSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7Z0JBQ3BCLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDdkIsTUFBTSxDQUFDLEdBQUcsQ0FBQztvQkFDUCxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSzt3QkFDMUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLEVBQUU7NEJBQ2pDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDeEIsQ0FBQztZQUNELHdDQUF3QztZQUN4QyxPQUFPLE1BQTZCLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxLQUFLLENBQ1AsR0FBRyxZQUE2QjtRQUVoQyxPQUFPLG1CQUFtQixDQUFJLFlBQVksQ0FBQyxDQUFDO0lBQ2hELENBQUM7Q0FDSjtBQUVEOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxPQUFPLENBQUMifQ==